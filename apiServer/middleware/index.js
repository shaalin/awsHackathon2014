'use strict';
var fs = require('fs');
module.exports = function() {
	var handlerFolderPath = __dirname + '/';
	fs.readdirSync(handlerFolderPath).forEach(function(handlerName) {
		if (handlerName.indexOf('Handler.js') !== -1) {
			module.exports[handlerName.substr(0, handlerName.length - 3)] = require(handlerFolderPath + handlerName);
		}
	});
};

module.exports();