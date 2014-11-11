var cluster = require('cluster');
var numCPUs = require('os').cpus().length - 2;
numCPUs = 2;
//numCPUs = 2;
var workersExpected = 0;
var workerRestartArray = [];
var fs = require('fs');

/**
 *	Setting up initial config
 **/
var config = {
	// script for workers to run (You probably will be changing this)
	exec: __dirname + '/server',
	workers: numCPUs,
	pidfile: './cluster_pidfile',
	log: __dirname + '/log/cluster.log',
	title: 'histHand-master',
	workerTitlePrefix: 'historicalHcp',
	silent: false, // don't pass stdout/err to the master
};

//Initalizing logging file
var logHandle = fs.createWriteStream(config.log, {
	flags: 'a'
});

//Logging function
var log = function(msg) {

	var sqlDateTime = function(time) {
		if (time == null) {
			time = new Date();
		}
		var dateStr =
			padDateDoubleStr(time.getFullYear()) +
			'-' + padDateDoubleStr(1 + time.getMonth()) +
			'-' + padDateDoubleStr(time.getDate()) +
			' ' + padDateDoubleStr(time.getHours()) +
			':' + padDateDoubleStr(time.getMinutes()) +
			':' + padDateDoubleStr(time.getSeconds());
		return dateStr;
	};

	var padDateDoubleStr = function(i) {
		return (i < 10) ? '0' + i : '' + i;
	};
	msg = sqlDateTime() + ' | ' + msg;
	logHandle.write(msg + '\r\n');
	console.log(msg);
};
log(' - STARTING CLUSTER -', ['bold', 'green']);

//Writing to the pidfile
if (config.pidfile !== null) {
	fs.writeFileSync(config.pidfile, process.pid.toString());
}
//Setting title of my process
process.title = config.title;
/**
 *	Catching SIGINT event from either the console or through kill -s
 **/
process.on('SIGINT', function() {
	log('Signal : SIGINT');
	workersExpected = 0;
	setupShutDown();
});

/**
 *	Catching SIGTERM event from either the console or through kill -s
 **/
process.on('SIGTERM', function() {
	log('Signal : SIGTERM');
	workersExpected = 0;
	setupShutDown();
});


/**
 *	Catching SIGTTIN event send through kill -s
 *  Things done
 *		Logging to console
 *		Checking if workersExpected is not more than cpus
 *      Incrementing workersExpected by 1
 *		Finally calling startAWorker();
 **/
process.on('SIGTTIN', function() {
	log('Singal : SIGTTIN');
	log('add a worker');
	if (workersExpected === numCPUs) {
		console.log('Can\'t add another worker as running max number of workers');
		return;
	}
	workersExpected++;
	startAWorker();
});

/**
 *	Catching SIGTTOU event send through kill -s
 *  Things done
 *		Logging to console
 *		Checking if workersExpected is 2 and returning by sending message to the console
 *      Decrementing workersExpected by 1
 *		Finally calling startAWorker();
 **/
process.on('SIGTTOU', function() {
	console.log('Singal : SIGTTOU');
	console.log('remove a worker');
	if (workersExpected === 2) {
		log('If you want to stop the server, use SIGINT, SIGTERM, SIGKILL');
		return;
	}
	workersExpected--;
	for (var i in cluster.workers) {
		var worker = cluster.workers[i];
		worker.send('stop');
		break;
	}
});

/**
 *	Catching SIGUSR2 event send through kill -s
 *  Things done
 *		Logging to console
 *		Adding all the workers to workerRestartArray;
 *      Calls reloadAWorker and that should cascade all calls;
 **/
process.on('SIGUSR2', function() {
	console.log('Singal : SIGUSR2');
	console.log('rolling restart');
	workerRestartArray = [];
	for (var i in cluster.workers) {
		workerRestartArray.push(cluster.workers[i]);
	}
	reloadAWorker();
});

function startAWorker() {
	var worker = cluster.fork();
	log('starting worker #' + worker.id);
	worker.on('message', function(message) {
		log('Message [' + worker.process.pid + ']:' + message);
	});
}

function reloadAWorker() {
	var count = 0;
	for (var i in cluster.workers) {
		count++;
	}
	if (workersExpected > count) {
		startAWorker();
	}
	if (workerRestartArray.length > 0) {
		var worker = workerRestartArray.pop();
		worker.send('stop');
	}
}

function setupShutDown() {
	log('Cluster manager quitting', 'red');
	log('Stopping each worker...');
	for (var i in cluster.workers) {
		cluster.workers[i].send('stop');
	}
	setTimeout(loopUntilNoWorkers, 1000);
}

function loopUntilNoWorkers() {
	if (cluster.workers.length > 0) {
		log('there are still ' + cluster.workers.length + ' workers...');
		setTimeout(loopUntilNoWorkers, 1000);
	} else {
		log('all workers gone');
		if (config.pidfile !== null) {
			fs.unlinkSync(config.pidfile);
		}
		process.exit();
	}
}

cluster.setupMaster({
	exec: config.exec,
	args: process.argv.slice(2),
	silent: config.silent
});

cluster.on('fork', function(worker) {
	log('worker ' + worker.process.pid + ' (#' + worker.id + ') has spawned');
});

cluster.on('exit', function(worker) {
	log('worker ' + worker.process.pid + ' (#' + worker.id + ') has exited');
	setTimeout(reloadAWorker, 1000);
});

cluster.on('listening', function(worker) {
	log('worker ' + worker.process.pid + ' (#' + worker.id + ') has started listening');
});

cluster.on('disconnect', function(worker) {
	log('worker ' + worker.process.pid + ' (#' + worker.id + ') has disconnected');
});

for (var i = 0; i < config.workers; i++) {
	workersExpected++;
	startAWorker();
}
