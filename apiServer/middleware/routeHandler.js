'use strict';

module.exports = function(app) {
	var controllersFolderPath = __dirname + '/../controllers/';
	require(controllersFolderPath)(app);
};