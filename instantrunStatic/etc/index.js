'use strict';
var env = process.env.NODE_ENV||'local';
var config = require('./config_'+env);

module.exports = config;