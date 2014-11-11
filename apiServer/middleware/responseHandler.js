'use strict';
var utility = require('./../utils/utility'),
	constants = require('./../utils/constants'),
	util = require('util');

/**
 *	This module is used to generate response based on data returned by controller
 *	1) Check if responseGenerator property is set on the res object
 *	2) Check to see if filter property is set on the res object
 *	2.a) Filter result based on filterFunction
 *	3) Check if headers property is set on the res object
 *	4) Check if location property is set on the res object
 *	5) Finally send the appropriate response
 **/
module.exports = function(options) {
	if (!options || !options.app) {
		utility.throwError(500, '50006', null, options, null);
	}
	var app = options.app;
	return function(req, res, next) {
		if (!res.responseGenerator) {
			return next();
		}
		var responseGenerator = res.responseGenerator;
		//Filtering fields of a result object
		if (responseGenerator.fields) {
			responseGenerator.result = responseGenerator.filterFunction(responseGenerator.result, responseGenerator.fields);
		}
		//Setting headers if any
		if (responseGenerator.headers) {
			res.set(responseGenerator.headers);
		}
		//Setting location header
		if (responseGenerator.location) {
			var config = app.get('config');
			var argLoc = [];
			argLoc.push(constants.LOCATIONDEFAULT + responseGenerator.location.url);
			argLoc.push(config.server.host);
			for (var iLoc = 0; iLoc < responseGenerator.location.sub.length; iLoc++) {
				argLoc.push(responseGenerator.result[responseGenerator.location.sub[iLoc]]);
			}
			res.set('Location', util.format.apply(null, argLoc));
		}
		//If there is result
		if (responseGenerator.result) {
			if (typeof responseGenerator.result === 'string') {
				res.status(responseGenerator.responseCode).send(responseGenerator.result);
			} else if (responseGenerator.responseSub) { //If response has to be formatted based on result
				var argRes = [];
				argRes.push(responseGenerator.responseSub.formatString);
				for (var iResult = 0; iResult < responseGenerator.responseSub.sub.length; iResult++) {
					argRes.push(responseGenerator.result[responseGenerator.responseSub.sub[iResult]]);
				}
				res.status(responseGenerator.responseCode).send(util.format.apply(null, argRes));
			} else { //If response is json
				res.json(responseGenerator.responseCode, responseGenerator.result);
			}
		} else {
			res.status(responseGenerator.responseCode).end();
		}
		var logObject = {
			'headers': {
				'responseTime': res.get('X-Response-Time'),
				'incomingData': req.body.Message,
				'messageType': req.body.messageType
			},
			'url': req.url
		};
		console.info(JSON.stringify(logObject));
	};

};