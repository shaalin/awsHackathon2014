'use strict';
var https = require('https'),
	utility = require('./../utils/utility'),
	constants = require('./../utils/constants'),
	config,
	requestQueue;

exports.init = function(app) {
	config = app.get('config');
	requestQueue = [];
};

exports.getToken = function(callback) {
	requestQueue.push(callback);
	if (requestQueue.length === 1) {
		_makeRequest();
	}
}


function _makeRequest() {
	var self = this,
		postData = {};

	postData.clientId = config.client.clientId;
	postData.accessKey = config.client.accessKey;
	var postDataString = JSON.stringify(postData);
	var options = {
		path: '/tokens',
		method: 'POST'
	};

	options.hostname = config.servers['auth'];


	// If running locally
	if (options.hostname === 'localhost') {
		options.port = config.servers['auth:port'];
		options.rejectUnauthorized = false;
		process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '0';
	} else {
		options.ca = config.caCertificates['auth'];
	}

	options.headers = {
		'Content-Type': 'application/json',
		'Content-Length': postDataString.length,
		'User-Agent': config.title
	};

	var req = https.request(options, function(res) {
		var result = '',
			isError = false;
		if (res.statusCode >= 400) {
			isError = true;
		}
		res.setEncoding('utf8');
		res.on('data', function(data) {
			result = result + data;
		});
		res.on('end', function() {
			result = JSON.parse(result);

			if (isError) {
				for (var i = requestQueue.length - 1; i >= 0; i--) {
					var cb = requestQueue.splice(i, 1)[0];
					options.ca = !!options.ca;
					cb(Error.http(res.statusCode, constants.errors['40099'].description, {
						'options': options,
						'error': result.error
					}), null);
				}
				return;
			} else {

				for (var i = requestQueue.length - 1; i >= 0; i--) {
					var cb = requestQueue.splice(i, 1)[0];
					cb(null, result);
				}
				return;
			}
		});
		res.on('error', function(err) {
			err.options.ca = !!err.options.ca;
			console.log(JSON.stringify(Error.toJson(err)));
			for (var i = requestQueue.length - 1; i >= 0; i--) {
				var cb = requestQueue.splice(i, 1)[0];

				cb(Error.http(500, constants.errors['50012'].description, {
					'options': options
				}, err), null);

			}
			return;
		});
	});

	req.write(postDataString);

	req.on('error', function(err) {
		err.options.ca = !!err.options.ca;
		console.log(JSON.stringify(Error.toJson(err)));
		for (var i = requestQueue.length - 1; i >= 0; i--) {
			var cb = requestQueue.splice(i, 1)[0];
			cb(Error.http(500, constants.errors['50012'].description, {
				'options': options
			}, err), null);
		}
		return;
	});

	req.end();
}