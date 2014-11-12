'use strict';
var userRepository,
	databaseService,
	utility = require('./../../utils/utility'),
	constants = require('./../../utils/constants');

/**
 *	Function to add user to the database
 *	@userDetails : user to be created in our system
 *  @callback : Async callback function
 **/
module.exports.insertUser = function insertUser(userDetails, callback) {
	var dbContextCls = {},
		rep,
		errorHandler = utility.wrapErrorHandler(dbContextCls, databaseService, callback);

	//Callback on receiving dbContext from the database service
	var onDbContext = utility.wrap(function(context) {
		dbContextCls.dbContext = context;
		rep = new userRepository(context);
		rep.getUser(userDetails.email, onUser);
	}, 'usersService.insertUser.onDbContext', errorHandler);
	//Callback on getting user data from the repository
	var onUser = utility.wrap(function(userData) {
		//Inline validation function
		(function() {
			if (userData && userData.userId) {
				utility.throwError(422, '42201', null, {
					'userId': userDetails.email
				}, null);
			}
		})();
		rep.addUser(userDetails, onInsertUser);
	}, 'usersService.insertUser.onUser', errorHandler);
	//Callback when the user is inserted
	var onInsertUser = utility.wrap(function() {
		databaseService.diposeDbContext(null, dbContextCls.dbContext, onDispose);
	}, 'usersService.insertUser.onNotificationPublish', errorHandler);
	//callback on dbcontext being disposed
	var onDispose = utility.wrap(function() {
		return callback(null, userDetails);
	}, 'usersService.insertUser.onDispose', callback);
	databaseService.getDbContext({
		tx: true
	}, onDbContext);
};



/**
 *	Function to retreive user
 *	@userId : userID of the user to retreived
 *  @callback : Async callback function
 **/
module.exports.getUser = function getUser(userId, callback) {
	var dbContextCls = {},
		user,
		errorHandler = utility.wrapErrorHandler(dbContextCls, databaseService, callback);
	//Callback on receving dbContext
	var onDbContext = utility.wrap(function(context) {
		dbContextCls.dbContext = context;
		var rep = new userRepository(dbContextCls.dbContext);
		rep.getById(userId, onUser);
	}, 'usersService.getUser.onDbContext', errorHandler);

	//Callback on getting user from the repository
	var onUser = utility.wrap(function(userFromDatabase) {
		(function() {
			if (!userFromDatabase) { //If the user is not present in the database

				utility.throwError(404, '40407', null, {
					'userId': userId
				}, null);
			}
		})();
		//Assigning user to user received from database
		user = userFromDatabase;
		//Diposing dbContext
		databaseService.diposeDbContext(null, dbContextCls.dbContext, onDispose);
	}, 'usersService.getUser.onUser', errorHandler);
	//Callback on dbContext being disposed.
	var onDispose = utility.wrap(function() {
		return callback(null, user);
	}, 'usersService.getUser.onDispose', callback);
	databaseService.getDbContext({
		tx: false
	}, onDbContext);
};

/**
 *	Function to retreive user
 *	@userId : emailId of the user to retreived
 *  @callback : Async callback function
 **/
module.exports.getUserFromEmail = function getUser(emailId, callback) {
	var dbContextCls = {},
		user,
		errorHandler = utility.wrapErrorHandler(dbContextCls, databaseService, callback);
	//Callback on receving dbContext
	var onDbContext = utility.wrap(function(context) {
		dbContextCls.dbContext = context;
		var rep = new userRepository(dbContextCls.dbContext);
		rep.getUser(emailId, onUser);
	}, 'usersService.getUserFromEmail.onDbContext', errorHandler);

	//Callback on getting user from the repository
	var onUser = utility.wrap(function(userFromDatabase) {
		(function() {
			if (!userFromDatabase) { //If the user is not present in the database

				utility.throwError(404, '40407', null, {
					'emailId': emailId
				}, null);
			}
		})();
		//Assigning user to user received from database
		user = userFromDatabase;
		//Diposing dbContext
		databaseService.diposeDbContext(null, dbContextCls.dbContext, onDispose);
	}, 'usersService.getUserFromEmail.onUser', errorHandler);
	//Callback on dbContext being disposed.
	var onDispose = utility.wrap(function() {
		return callback(null, user);
	}, 'usersService.getUserFromEmail.onDispose', callback);
	databaseService.getDbContext({
		tx: false
	}, onDbContext);
};






module.exports.init = function init(app, repositories) {
	var config = app.get('config');
	userRepository = repositories.usersRepository;
	databaseService = app.get('sharedServices')[config.shared.names.databaseService];
};