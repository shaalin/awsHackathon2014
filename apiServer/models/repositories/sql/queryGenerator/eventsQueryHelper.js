'use strict';
var constants = require('./../../../../utils/constants');



/**
 *	Function to create insert user query
 **/
exports.addEvent = function addEvent(queryContext, dbContext) {
	var data = queryContext.data,
		connection = dbContext.connection;
	var valueSeparator = constants.query.valueSeparator;
	var query = 'insert into CancerDB.userEvents (email, eventId, paid) values ' +
		'(' + connection.escape(data.email) + valueSeparator +
		connection.escape(data.eventId) + valueSeparator +
		connection.escape(data.paid) + ')';
	return query;
};
