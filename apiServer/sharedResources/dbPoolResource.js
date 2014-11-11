'use strict';
var mysql = require('mysql'),
	constants = require('./../utils/constants');

var DbPool = module.exports = {};
//exports = module.exports = Database;

DbPool.init = function(app, callback) {
	var config = app.get('config');
	this.pool = mysql.createPool(config.database.options);
	var self = this;
	this.pool.getConnection(function(err, connection) {
		if (!err) {
			self.closeConnection(null, connection);
			return callback(null);
		} else {
			return callback(err);
		}
	});
};

DbPool.getConnection = function(callback) {
	return this.pool.getConnection(function(err, connection) {
		if (!err) {
			return callback(null, connection);
		} else {
			return callback(Error.http(500, 'Unable to create Database connection', {
				err: constants.errors['5001']
			}, err));
		}
	});
};

DbPool.closeConnection = function(err, connection) {
	//if the err is fatal for the connection destroying the connection
	if (err) {
		err = err.inner || err;
	}
	if (err && err.fatal) {
		connection.destory();
	} else {
		connection.release();
	}
};

DbPool.dispose = function() {
	//Checking if the pool exists
	if (this.pool != null) {
		//closing the pool
		this.pool.end();
	} else {
		console.log('No connections to close');
	}
	console.log('Db disposed');
};