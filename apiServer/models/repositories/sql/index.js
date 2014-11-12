'use strict';
var fs = require('fs');

module.exports = function(dependencies) {
	var daos = [];
	var daoFolderPath = __dirname + '/';
	var parentDao = require('./dao.js');
	fs.readdirSync(daoFolderPath).forEach(function(daoName) {
		if (daoName.indexOf('Dao.js') !== -1 && daoName.indexOf('dbInterface.js') === -1) {
			var dao = require(daoFolderPath + daoName);
			dao.init(dependencies, parentDao);
			daos[daoName.substr(0, daoName.length - 3)] = dao;
		}
	});
	return daos;
};