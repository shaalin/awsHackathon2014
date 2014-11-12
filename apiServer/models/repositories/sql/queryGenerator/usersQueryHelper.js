'use strict';
var constants = require('./../../../../utils/constants');

/**
 *	Function to get get user by Id
 **/
exports.getUser = function getUser(queryContext, dbContext) {
	var data = queryContext.data,
		connection = dbContext.connection;
	//Query for selecting user
	//Query for selecting user
	var userQuery = 'select us.email, us.firstName, us.lastName, us.password, us.phoneNo, us.profilePic from CancerDB.users us ' +
		' where us.email = ' + connection.escape(data);
	console.log(userQuery);
	return userQuery;
};

/**
 *	Function to get user properites
 **/
exports.getUserProperties = function getUserProperties(queryContext, dbContext) {
	var data = queryContext.data,
		connection = dbContext.connection;
	//Query for selecting user
	var userQuery = 'select us.email, us.name, us.value from CancerDB.userProperties us ' +
		' where us.email = ' + connection.escape(data);
		console.log(userQuery);
	return userQuery;
};

/**
 *	Function to create insert user query
 **/
exports.addUser = function addUser(queryContext, dbContext) {
	var data = queryContext.data,
		connection = dbContext.connection;
	var valueSeparator = constants.query.valueSeparator;
	var query = 'insert into CancerDB.users (email, firstName, lastName, password, phoneNo, profilePic) values ' +
		'(' + connection.escape(data.email) + valueSeparator +
		connection.escape(data.firstName) + valueSeparator +
		connection.escape(data.lastName) + valueSeparator +
		connection.escape(data.password) + valueSeparator +
		connection.escape(data.phoneNo) + valueSeparator +
		connection.escape(data.profilePic) + ')';
	return query;
};

/**
 *	Function to update user
 **/
exports.addUserProperties = function addUserProperties(queryContext, dbContext) {
	var data = queryContext.data;
	var connection = dbContext.connection;
	var valueSeparator = constants.query.valueSeparator;
	var shotsQuery = 'insert into CancerDB.userProperties(email, name, value) values';

	var shotsQueryParts = [];
	for (var i = 0, len = data.properties.length; i < len; i++) {
		var currProperty = data.properties[i];
		shotsQueryParts.push('(' + connection.escape(data.email) + valueSeparator +
			connection.escape(currProperty.name) + valueSeparator +
			connection.escape(currProperty.value) + ')');
	}
	shotsQuery = shotsQuery + shotsQueryParts.join();
	return shotsQuery;
};
