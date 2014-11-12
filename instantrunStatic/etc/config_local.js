/*
	NOTE - You will need to create the 'arccos_api_app' user on your local mysql instance with pw 'arcc0s'.

	CREATE USER 'arccos_api_app'@'localhost' IDENTIFIED BY 'arcc0s';
	GRANT ALL ON mydb.* TO 'arccos_api_app'@'localhost';
*/

'use strict';
var config = require('./config_global');

config.shared.env = 'local';

config.server.port = 9080;
config.server.host = 'localhost';

module.exports = config;

config.servers = [];

config.servers['api'] = 'api.arccosgolf.com';
config.servers['auth'] = 'authentication.arccosgolf.com';
config.servers['aws'] = 'sns.us-west-2.amazonaws.com';
