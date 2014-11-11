'use strict';
var exports = module.exports = {},
	constants = require('./constants');

exports.validateAndParseInt = function(inputString) {
	var pattern = new RegExp('^[-]?[0-9]+$');
	if (pattern.test(inputString)) {
		var returnValue = parseInt(inputString, 10);
		return returnValue;
	} else {
		return null;
	}
};

exports.validateAndParseFloat = function(inputString) {
	var pattern = new RegExp('^[-]?[0-9]*[.]?[0-9]+$');
	if (pattern.test(inputString)) {
		var returnValue = parseFloat(inputString);
		return returnValue;
	} else {
		return null;
	}
};

exports.wrap = function wrap(fn, component, callback) {
	return function wrapper(err, result) {
		if (err) {
			if (err.status) {

				err.component = err.component + '--->' + component;
				return callback(err);
			}
			return callback(
				Error.http(500, 'An undetected error has occurred', {
					'component': component
				}, err));
		}
		try {
			return fn(result);
		} catch (err) {
			if (err.status) {
				err.component = component;
				return callback(err);
			}
			return callback(
				Error.http(500, 'An internal error has occurred', {
					'component': component
				}, err));
		}
	};
};

exports.wrapResponse = function wrapResponse(req, res, next) {
	return function wrapperForResponse(err, result) {
		if (err) {
			return next(err);
		} else {
			res.responseGenerator.result = result;
			return next();
		}
	};
};

exports.throwError = function throwError(code, internalCode, devDescription, data, internalError) {
	var standardError = constants.errors[internalCode];
	var errorObj = {
		'code': standardError.code,
		'description': standardError.description,
		'devDescription': devDescription,
		'incomingData': data
	};
	throw Error.http(code, standardError.description, errorObj, internalError);
};

exports.wrapErrorHandler = function wrapErrorHandler(dbContextCls, databaseService, callback) {
	return function wrapperForErrorHandler (err) {
		if (dbContextCls.dbContext) {
			databaseService.diposeDbContext(err, dbContextCls.dbContext, function() {
				return callback(err);
			});
		} else {
			return callback(err);
		}
	};
};



exports.stringifyAndTruncate = function stringifyAndTruncate(json, charLength){
	return JSON.stringify(json).slice(0, charLength || 100)
}
