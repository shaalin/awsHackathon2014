'use strict';
var utility = require('./../utils/utility');
module.exports = function(options) {
	if (!options || !options.app) {
		utility.throwError(500, '50008', null, options, null);
	}
	var app = options.app;
	return function(req, res, next) {
		if (app.get('isGracefulShutDown')) {
			res.setHeader('Connection', 'close');
			res.send(502, 'Server is in the process of restarting.');
		} else {
			next();
		}
	};
};