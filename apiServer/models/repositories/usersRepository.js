'use strict';
module.exports = UsersRepository;
var utility = require('./../../utils/utility'),
	Dao;

function UsersRepository(context) {
	this.context = context;
}

/**
 *  Function to retreived user based on userId
 *  userId : User id
 **/
UsersRepository.prototype.getUser = function getUser(email, callback) {
	var dao = new Dao(this.context);
	var onUserRawData = utility.wrap(function(user) {
		return callback(null, user);
	}, 'UsersRepository.getById.onUserRawData', callback);

	dao.getUser(email, onUserRawData);
};


UsersRepository.prototype.addUser = function addUser(user, callback) {
	var dao = new Dao(this.context);
	var onUserAdd = utility.wrap(function(user) {
		return callback(null, user);
	}, 'UsersRepository.getById.onUserAdd', callback);

	dao.addUser(user, onUserAdd);
};


module.exports.init = function init(depdendencies, daos, caches) {
	Dao = daos.usersDao;
};