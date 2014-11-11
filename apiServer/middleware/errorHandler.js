'use strict';
var utility = require('./../utils/utility');
module.exports = function(options) {
	if (!options || !options.app) {
		utility.throwError(500, '50007', null, options, null);
	}
	return function(err, req, res, next) {
		//Adding url to error object
		err.url = req.url;
		err.incomingData = req.body;
		err.messageType = req.body ? req.body.messageType : null;
		console.error(JSON.stringify(Error.toJson(err)));
		if (err.status) {
			res.json(err.status, {
				error: {
					code: err.code || err.status || 500,
					description: err.description || err.message || 'internal server error'
				}
			});

		} else {
			res.status(500).json(err.message);
		}
	};
};