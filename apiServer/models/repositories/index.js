'use strict';
var fs = require('fs');

module.exports = function(dependencyObject) {
	var repositoryFolderPath = __dirname + '/';
	var sqlDao = require('./sql')(dependencyObject);
	var daos = [];
	for (var i in sqlDao) {
		if (sqlDao.hasOwnProperty(i)) {
			daos[i] = sqlDao[i];
		}
	}
	fs.readdirSync(repositoryFolderPath).forEach(function(respositoryName) {
		if (respositoryName.indexOf('Repository.js') !== -1) {
			var moduleName = respositoryName.substr(0, respositoryName.length - 3);
			module.exports[moduleName] = require(repositoryFolderPath + respositoryName);
			module.exports[moduleName].init(dependencyObject, daos);
		}
	});
};