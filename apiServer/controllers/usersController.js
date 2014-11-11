'use strict';
var 
	constants = require('./../utils/constants'),
	utility = require('./../utils/utility');


function postUser(req, res, next){
	res.responseGenerator = {};
	res.responseGenerator.responseCode = 201;
	process.nextTick(function(){
		var functionToCall = utility.wrapResponse(req, res, next);
		req.body.userId = 12321321;
		functionToCall(null, req.body);
	});
}

function getUser(req, res, next){
	console.log('In Here');
	res.responseGenerator = {};
	res.responseGenerator.responseCode = 200;
	process.nextTick(function(){
		var functionToCall = utility.wrapResponse(req, res, next);
		req.body.userId = req.params.userId;
		functionToCall(null, req.body);
	});
}


module.exports.init = function(app, services) {
	app.post('/users', postUser);
	app.get('/users/:userId', getUser);
};