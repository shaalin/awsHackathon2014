'use strict';
var usersService,
	constants = require('./../utils/constants'),
	utility = require('./../utils/utility');


function postUser(req, res, next){
	res.responseGenerator = {};
	res.responseGenerator.responseCode = 201;
	usersService.insertUser(req.body,utility.wrapResponse(req, res, next));
}

function getUser(req, res, next){
	res.responseGenerator = {};
	res.responseGenerator.responseCode = 200;
	usersService.getUserFromEmail(req.params.userId, utility.wrapResponse(req, res, next));
}

function addEvent(req, res, next){
	res.responseGenerator = {};
	res.responseGenerator.responseCode = 201;

	req.body.email = req.params.userId;
	req.body.eventId = req.params.eventId;
	usersService.addUserEvent(req.body, utility.wrapResponse(req, res, next));
}


module.exports.init = function(app, services) {
	usersService = services.usersService;
	app.post('/users', postUser);
	app.get('/users/:userId', getUser);
	app.post('/users/:userId/events/:eventId', addEvent);
};
