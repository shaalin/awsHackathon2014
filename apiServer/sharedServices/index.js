'use strict';
var fs = require('fs');

module.exports = function(dependencies) {
	var services = {};
	var serviceFolderPath = __dirname + '/';
	fs.readdirSync(serviceFolderPath).forEach(function(serviceName) {
		if (serviceName.indexOf('Service.js') !== -1) {
			var service = require(serviceFolderPath + serviceName);
			service.init(dependencies);
			services[serviceName.substr(0, serviceName.length - 3)] = service;
		}
	});
	return services;
};