'use strict';
exports = module.exports = EventsDao;
var utility = require('./../../../utils/utility'),
	queryGenerator = require('./queryGenerator/eventsQueryHelper'),
	Dao,
	utils = require('util');

function EventsDao(dbContext) {
	Dao.call(this, dbContext);
}

module.exports.init = function(dependencyObject, parentDao) {
	Dao = parentDao;
	utils.inherits(EventsDao, Dao);
	_setProtoType();
};

function _setProtoType() {

	/**
	 *	Function to add a user
	 *	@user :{round} user data
	 **/
	EventsDao.prototype.addEvent = function addEvent(user, callback) {
		var queries = [],
			self = this;
		//Query to add userData
		queries.push({
			queryGenerator: queryGenerator.addEvent
		});
		self.queryContext = {
			data: user,
			result: {},
			queries: queries
		};
		var onEventAdd = utility.wrap(function() {
			return callback();
		}, 'EventsDao.addEvent.onEventAdd', callback);
		this.executeQueryContext(onEventAdd);
	};

}
