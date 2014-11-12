'use strict';
var config = module.exports = {},
	fs = require('fs'),
	path = require('path');

config.title = 'awsHackathon2014';
config.server = {};
config.server.port = 9080;

config.database = {};
config.database.options = {
	host: 'mysqldb.ckpwbv6ldizi.us-west-1.rds.amazonaws.com',
	user: process.env.RDS_USER,
	password: process.env.RDS_PASSWORD,
	connectionLimit: 5,
	charset: 'UTF8_UNICODE_CI'
};



config.shared = {};
config.shared.parentDir = path.join(module.filename, './../..');


//Names for shared resources and services
config.shared.names = {};

//sharedResources
config.shared.names.connectionPool = 'dbPoolResource';
config.shared.names.cache = 'redisResource';

//services
config.shared.names.databaseService = 'databaseService';

config.shared.killSignals = ['SIGINT', 'SIGTERM'];

config.servers = [];
config.client = {};
config.client.clientId = process.env.CLIENT_ID;
config.client.accessKey = process.env.CLIENT_ACCESS_KEY;
