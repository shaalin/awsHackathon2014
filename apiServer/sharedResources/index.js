'use strict';
var EventEmitter = require('events').EventEmitter,
	utils = require('util'),
	fs = require('fs');

/*
 *  This is a constructor function for shared resources.
 *  count is the number of shared resources that are supposed to be initiated
 *  by this module.
 */

function Shared() {
	EventEmitter.call(this);
	this.count = 0;
	this.resources = {};
	var self = this;
	fs.readdirSync(__dirname + '/').forEach(function(sharedResourceName) {
		if (sharedResourceName.indexOf('Resource.js') !== -1) {
			self.count++;
		}
	});
}

//Inheriting from event emitter.
utils.inherits(Shared, EventEmitter);

/*
 *  This function initalizes all the shared resources and assigns it to the
 *  resources variable. Which is then used by all the different components
 *  of the applciation.
 */
Shared.prototype.init = function(dependencies) {
	var self = this;
	var resourcesFolderPath = __dirname + '/';

	fs.readdirSync(resourcesFolderPath).forEach(function(sharedResourceName) {
		if (sharedResourceName.indexOf('Resource.js') !== -1) {
			var sharedResource = require(resourcesFolderPath + sharedResourceName);
			sharedResource.init(dependencies, reduceCount);
			self.resources[sharedResourceName.substr(0, sharedResourceName.length - 3)] = sharedResource;
		}
	});

	//The count variable is decremented everytime a new sharedResource is
	//succesfully initalized and when the count reaches zero it emits
	//Initalized event, which is used by the server to start listening.

	function reduceCount(err) {
		if (err) {
			self.emit('error', err);
		} else {
			console.log('Count : ' + self.count);
			self.count--;
			if (self.count === 0) {
				self.emit('Initalized');
			}
		}
	}
};

/*
 *  The function loops through each and every service and calls the dispose
 *  function, so that all the services are shutdown befor teh process exits
 *  allowing for a clean exit without any memory references hanging in a
 *  state of limbo.
 */
Shared.prototype.dispose = function() {
	var keys = Object.keys(this.resources);
	for (var i = 0; i < keys.length; i++) {
		this.resources[keys[i]].dispose();
	}
};

module.exports = Shared;