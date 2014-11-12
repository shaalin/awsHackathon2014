'use strict';
var fs = require('fs'),
	repositories = require('./../repositories');

module.exports = function(app) {
	var services = {};
	var serviceFolderPath = __dirname + '/';
	repositories(app);
	fs.readdirSync(serviceFolderPath).forEach(function(serviceName) {
		if (serviceName.indexOf('Service.js') !== -1) {
			var service = require(serviceFolderPath + serviceName);
			service.init(app, repositories);
			services[serviceName.substr(0, serviceName.length - 3)] = service;
		}
	});
	return services;
};