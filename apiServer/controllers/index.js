'use strict';
var fs = require('fs');
 
module.exports = function(app){
	var services = require('./../models/services')(app);
    var controllersFolderPath = __dirname + '/../controllers/';
    fs.readdirSync(controllersFolderPath).forEach(function(controllerName){
        if(controllerName.indexOf('Controller.js') !== -1){
            var controller = require(controllersFolderPath + controllerName);
            controller.init(app, services);
        }
    });
};