'use strict';
exports = module.exports = UsersDao;
var utility = require('./../../../utils/utility'),
	queryGenerator = require('./queryGenerator/usersQueryHelper'),
	mapper = require('./mapper/usersMapper'),
	Dao,
	utils = require('util');

function UsersDao(dbContext) {
	Dao.call(this, dbContext);
}

module.exports.init = function(dependencyObject, parentDao) {
	Dao = parentDao;
	utils.inherits(UsersDao, Dao);
	_setProtoType();
};

function _setProtoType() {

	/**
	 *	Function to add a user
	 *	@user :{round} user data
	 **/
	UsersDao.prototype.addUser = function addUser(user, callback) {
		var queries = [],
			self = this;
		//Query to add userData
		queries.push({
			queryGenerator: queryGenerator.addUser
		});
		//Query to add userData
		queries.push({
			queryGenerator: queryGenerator.addUserProperties
		});
		self.queryContext = {
			data: user,
			result: {},
			queries: queries
		};
		var onUserAdd = utility.wrap(function() {
			return callback();
		}, 'UsersDao.addUser.onUserAdd', callback);
		this.executeQueryContext(onUserAdd);
	};

	/**
	 *	Function to delete a round
	 *	@email : of the user
	 **/
	UsersDao.prototype.getUser = function getUser(email, callback) {
		var queries = [],
			self = this;
		//Query to get user data
		queries.push({
			queryGenerator: queryGenerator.getUser,
			resultProcessor : mapper.mapUser
		});
		queries.push({
			queryGenerator: queryGenerator.getUserProperties,
			resultProcessor : mapper.mapUserProperties
		});
		self.queryContext = {
			data: email,
			result: {},
			queries: queries
		};
		var onGetUser = utility.wrap(function() {
			return callback(null, self.queryContext.result);
		}, 'UsersDao.getUser.onGetUser', callback);
		this.executeQueryContext(onGetUser);
	};

}