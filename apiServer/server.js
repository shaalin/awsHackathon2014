var express = require('express'),
	config = require('./etc'),
	SharedResources = require('./sharedResources'),
	server = null,
	app = express(),
	sharedServices = require('./sharedServices'),
	middlewares = require('./middleware'),
	cluster = require('cluster'),
	SERVER_CLOSE = false,
	bodyParser = require('body-parser'),
	responseTime = require('response-time');

require('simple-errors');

function startServer() {
	app.set('config', config);
	process.title = config.title;
	if (cluster.isWorker) {
		process.title = 'historicalHcp-' + cluster.worker.id;
	}
	//Creating an instance of SharedResources
	var appSharedResources = new SharedResources();
	/**
	 *  'Initalized' event is emitted by SharedResources when
	 *  all the services that are supposed to be shared by
	 *  the application are initalized, once this services
	 *  are initalized then we call listen on express.
	 *  Also the returned HTTP server is saved in the
	 *  server variable so that it can be used during the
	 *  shutdown process.
	 **/
	appSharedResources.once('Initalized', function() {
		app.set('sharedServices', sharedServices(app));
		//app.set('services', services(app));
		_configureServer();
		//server = https.createServer(config.ssl.options, app).listen(config.server.port);
		server = app.listen(config.server.port);
		server.on('close', function() {
			SERVER_CLOSE = true;
			appSharedResources.dispose();
		});

		console.log('Express application listening on port' + config.server.port);
	});

	/**
	 *  Listener for error event, this event is fired when error occurs while setting up resources
	 *  Logs the error
	 *  Disposes any resources
	 *  Finally calls process.exit(-1)
	 **/
	appSharedResources.on('error', function(err) {
		console.error('Not able to initalize sharedResources, hence shutting down');
		console.error(JSON.stringify(Error.toJson(err)));
		appSharedResources.dispose();
		process.exit(-1);
	});

	//Initating appSharedResources
	appSharedResources.init(app);
	//Setting sharedResources on the app;
	app.set('sharedResources', appSharedResources);

	// handle signals from master if running in cluster
	if (cluster.isWorker) {
		process.on('message', function(msg) {
			if (msg === 'stop') {
				process.send('stopping');
				_gracefulShutDown();
				process.send('stopped');
			}
		});
	}

	// Execute commands in clean exit
	process.on('exit', function(code) {
		if (code === -1 && !SERVER_CLOSE) {
			appSharedResources.dispose();
		}
		console.log('Exiting ...');
		//Calling SharedResources dispose method which internally will gracefully
		//and cleanly shut the services/resources down, to ensure there are no
		//hanging memory references.
		console.log('bye');
	});


	//What if an error occurs
	process.on('error', function(err) {
		console.error('Unhandled error has occured');
		console.error(JSON.stringify(Error.toJson(err)));
		process.exit(-1);
	});

	for (var i = 0; i < config.shared.killSignals.length; i++) {
		process.on(config.shared.killSignals[i], function() {
			console.log('\nGracefully shutting down from  SIGINT (Crtl-C)');
			_gracefulShutDown();
		});
	}

	/* 
	 *  Internal function to set the isGracefulShutDown variable to true, which is
	 *  used in the middleware to send server shutdown message to keep-alive connections.
	 *  Also server.close() is called so that no additional requests are handled by the
	 *  server.
	 *  Finally a
	 *  callback function for forcefull shutdown is set to forcefully shutdown the
	 *  server if the server doesn't shutdown in a stipulated time period.
	 */

	function _gracefulShutDown() {
		app.set('isGracefulShutDown', true);
		setTimeout(function() {
			process.exit(-1);
		}, 5 * 1000);
		if (cluster.isWorker) {
			cluster.worker.disconnect();
		} else {
			server.close();
		}
	}

	function _configureServer() {
		//Generic Logger
		app.use(express.static(__dirname + '/public'));
		app.use(responseTime());
		app.use(bodyParser.json({
			type: 'application/json'
		}));
		//hook for sending close connection to keep-alive connecitons
		app.use(middlewares['gracefulShutdownHandler']({
			'app': app
		}));
		/*
		 *  This utility function goes through each and every file in the controller
		 *  folder and calls the init function of the controller. This utility is to
		 *  abstract away route middleware from the main server file.
		 */
		middlewares['routeHandler'](app);
		app.use(middlewares['responseHandler']({
			'app': app
		}));
		app.use(middlewares['errorHandler']({
			'app': app
		}));
	}
}

startServer();