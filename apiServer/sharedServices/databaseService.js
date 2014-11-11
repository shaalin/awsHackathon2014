'use strict';
var utility = require('./../utils/utility'),
	constants = require('./../utils/constants');

exports.init = function(app) {
	var config = app.get('config');
	this.dbPool = app.get('sharedResources').resources[config.shared.names.connectionPool];
};

/**
 *	Function to create a transactional context
 * 	@options : {object} passed by the service
 *	@callback : {function} Async callback
 **/

function _createTxContext(options, callback) {
	function errorHandler(err) {
		if (con) {
			self.dbPool.closeConnection(err, con);
		}
		return callback(err);
	}
	var con,
		self = this;
	//Callback on getting connection from db pool
	var onConnection = utility.wrap(function(connection) {
		con = connection;
		con.query('start transaction;', onTransaction);
	}, 'databaseService._createTxContext.onConnection', errorHandler);
	//Callback on transaction query being successfully fired 
	var onTransaction = utility.wrap(function() {
		return callback(null, {
			'connection': con,
			tx: true
		});
	}, 'databaseService._createTxContext.onTransaction', errorHandler);

	//Error Handle incase an error occurs

	this.dbPool.getConnection(onConnection);
}

/**
 *	Function to create a simple db context
 *	@options : {object} options passed by user
 **/

function _createNonTxContext(options, callback) {
	//Callback on receiving connection from db pool
	var onConnection = utility.wrap(function(con) {
		return callback(null, {
			'connection': con,
			tx: false
		});
	}, 'databaseService._createNonTxContext.onConnection', callback);

	this.dbPool.getConnection(onConnection);

}

/**
 *	Function to dipose tx db context
 *	@err : {Error} error incase raised
 *	@dbContext : {object} context to dispose
 **/

function _disposeTxDbContext(err, dbContext, callback) {
	var statement = 'commit',
		con = dbContext.connection,
		self = this;
	if (err) {
		statement = 'rollback';
	}
	//TODO what if an error is encountered while running commit
	var onStatement = utility.wrap(function() {
		self.dbPool.closeConnection(err, con);
		return callback(err);
	}, 'databaseService._diposeTxDbContext.onStatement', callback);

	con.query(statement, onStatement);
}

/**
 *	Function to dipose simple db context
 *	@err : {Error} error incase raised
 *	@dbContext : {object} context to dispose
 **/

function _disposeNonTxDbContext(err, dbContext, callback) {
	this.dbPool.closeConnection(err, dbContext.connection);
	process.nextTick(function() {
		return callback(err);
	});
}

/**
 *	Function to create dbContext
 *	@options : {object} having all the options for dbContext
 *  callback : {function} Async callback function
 **/
exports.getDbContext = function(options, callback) {
	//Handling error incase the options are not properly setup
	if (options == null || options.tx == null) {
		process.nextTick(function() {
			var errorObject = Error.http(500, constants.errors['50005'].description, constants.errors['50005'], null);
			errorObject.data = options;
			return callback(errorObject);
		});
		return;
	} else if (options.tx) {
		return _createTxContext.call(this, options, callback);
	}
	return _createNonTxContext.call(this, options, callback);
};

/**
 *	Function to dispose context
 *	@err : {Error} encountered in the application
 *  @dbContext : {object} db context to dipose
 **/
exports.diposeDbContext = function(err, dbContext, callback) {
	var tx = dbContext.tx;
	if (tx) {
		return _disposeTxDbContext.call(this, err, dbContext, callback);
	}
	return _disposeNonTxDbContext.call(this, err, dbContext, callback);
};

