'use strict';
exports = module.exports = dao;
var utility = require('./../../../utils/utility'),
	dbInterface = require('./dbInterface');

function dao(dbContext) {
	this.dbContext = dbContext;
}

/**
 *	Function to process query context being set by individual dao
 *	1) If dbContext is transactional runQueries is called
 *	2) If dbContext is nonTransactional runTransactional query is called
 *	3) If there is only one query to run runQuery is called
 **/
dao.prototype.executeQueryContext = function executeQueryContext(callback) {
	if (this.queryContext.queries.length === 1) {
		return this._runQuery(callback);
	} else if (this.dbContext.tx) {
		return this._runQueries(callback);
	}
	return this._runTransactionalQueries(callback);
};

/**
 *	Function to process a single query
 **/
dao.prototype._runQuery = function(callback) {
	var self = this,
		queryTask = this.queryContext.queries[0];
	var onResult = utility.wrap(function(queryResult) {
		//If queryTask is not having result processor don't process the result
		if (queryTask.resultProcessor)
			queryTask.resultProcessor(queryResult, self.queryContext);
		return callback();
	}, 'dao._runQuery.onResult', callback);

	dbInterface.runQuery(queryTask.queryGenerator(self.queryContext, self.dbContext), self.dbContext.connection, onResult);
};

/**
 *	Function to process multiple queries when the dbContext is transactional
 *
 **/
dao.prototype._runQueries = function(callback) {
	var self = this,
		queriesClone = this.queryContext.queries.slice(0),
		queryTask = queriesClone.shift();

	var runIndividualQuery = utility.wrap(function runIndividualQueryInner(queryResult) {
		if (queryTask.resultProcessor) {
			queryTask.resultProcessor(queryResult, self.queryContext);
		}
		queryTask = queriesClone.shift();
		if (queryTask && self.queryContext.result) {
			return dbInterface.runQuery(queryTask.queryGenerator(self.queryContext, self.dbContext), self.dbContext.connection, runIndividualQuery);
		}
		return callback();
	}, 'dao._runQueries.runIndividualQuery', callback);
	dbInterface.runQuery(queryTask.queryGenerator(self.queryContext, self.dbContext), self.dbContext.connection, runIndividualQuery);
};

/**
 *	Function to run multiple queries when the passed dbContext is not transactional
 *
 **/
dao.prototype._runTransactionalQueries = function(callback) {
	var self = this;

	function errorHandler(err) {
		dbInterface.runQuery('rollback', self.dbContext.connection, function() {
			return callback(err);
		});
	}
	var onTransaction = utility.wrap(function() {
		self._runQueries(onQueriesCompleted);
	}, 'dao._runTransactionalQueries.onTransaction', errorHandler);
	var onQueriesCompleted = utility.wrap(function() {
		dbInterface.runQuery('commit', self.dbContext.connection, onCommit);
	}, 'dao._runTransactionalQueries.onQueriesCompleted', errorHandler);
	var onCommit = utility.wrap(function() {
		return callback();
	}, 'dao._runTransactionalQueries.onCommit', errorHandler);


	dbInterface.runQuery('start transaction', self.dbContext.connection, onTransaction);
};