'use strict';
var constants = require('./../../../utils/constants');

exports.runQuery = function runQuery(query, con, callback) {
	_tryUntilSuccess(query, con, 1, true, callback);
};

function _tryUntilSuccess(query, con, retryLimit, firstTry, callback) {
	con.query(query, function onDataFromConnection(err, results) {
		if (!err) {
			return callback(null, results);
		} else if (err.code === 'ER_LOCK_DEADLOCK' && (retryLimit > 0)) { // Deadlock
			if (firstTry) {
				retryLimit = constants.database.retryLimits['ER_LOCK_DEADLOCK'];
				firstTry = false;
			}

			console.error(JSON.stringify(Error.http(500, constants.errors['50015'].description, {
				'code': 50015,
				'component': 'dbInterface._tryUntilSuccess.onDataFromConnection',
				'firstTry': firstTry,
				'retryLimit': retryLimit,
				'query': query
			})));


			_tryUntilSuccess(query, con, --retryLimit, firstTry, callback)
		} else if (err.fatal) {
			return callback(Error.http(500, constants.errors['50001'].description, {
				'err': constants.errors['50001'],
				'component': 'genericDao.runQuery',
				'query': query
			}, err));
		} else {
			return callback(Error.http(400, constants.errors['40001'].description, {
				'err': constants.errors['40001'],
				'component': 'genericDao.runQuery',
				'query': query
			}, err));
		}
	});
}
