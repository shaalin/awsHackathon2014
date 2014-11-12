'use strict';
module.exports = EventRepository;
var utility = require('./../../utils/utility'),
	Dao;

function EventRepository(context) {
	this.context = context;
}

/**
 *  Function to retreived user based on userId
 *  userId : User id
 **/
EventRepository.prototype.addEvent = function addEvent(event, callback) {
	var dao = new Dao(this.context);
	var onUserRawData = utility.wrap(function(user) {
		return callback(null, event);
	}, 'EventRepository.addEvent.onEventAdd', callback);

	dao.addEvent(event, onUserRawData);
};



module.exports.init = function init(depdendencies, daos, caches) {
	Dao = daos.eventsDao;
};