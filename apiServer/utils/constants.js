'use strict';

var constants = {};
module.exports = constants;
constants.TRUE = 'T';
constants.FALSE = 'F';
constants.LOCATIONDEFAULT = 'https://%s/';
// Query Constants
constants.query = {};
constants.query.offSet = 0;
constants.query.limit = 10;
constants.query.valueSeparator = ',';
constants.query.dateFormat = '%Y-%m-%dT%H:%i:%s.%fZ';

constants.http = {};
constants.http.requestQueueLimit = 5;

constants.database = {};
constants.database.retryLimits = {};
constants.database.retryLimits['ER_LOCK_DEADLOCK'] = 3;

constants.messageTypes = {
	SUBSCRIPTION: 'SubscriptionConfirmation',
	NOTIFICATION: 'Notification'
};

// Errors
constants.errors = {};
constants.errors['40001'] = {
	code: 40001,
	description: 'Data quality issues, please check the data being sent to the server.'
};


constants.errors['40407'] = {
	code: 40407,
	description: 'User doesn\'t exist.'
};

constants.errors['40009'] = {
	code: 40009,
	description: 'Invalid data passed.'
};
constants.errors['40021'] = {
	'description': 'Received a message that this engine can not process.'
};
constants.errors['40022'] = {
	'description': 'Received a message that is not having type attribute.'
};



constants.errors['40098'] = {
	code: 40098,
	'description': 'Received a message that was not published to an SNS Topic.'
};

constants.errors['40099'] = {
	code: 40099,
	'description': 'Unable to get token'
};


constants.errors['42291'] = {
	code: 42291,
	description: 'This engine can\'t subscribe to the topic passed in the confirmSubcription message.'
};

constants.errors['50001'] = {
	code: 50001,
	description: 'Internal Database error, not able to create connection'
};

constants.errors['50004'] = {
	code: 50004,
	description: 'Internal Database error, not able to execute query.'
};

constants.errors['50006'] = {
	code: 50006,
	description: 'Internal error, options for responseHandler not passed.'
};

constants.errors['50007'] = {
	code: 50007,
	description: 'Internal error, options for errorHandler not passed.'
};

constants.errors['50008'] = {
	code: 50008,
	description: 'Internal error, options for gracefulShutdownHandler not passed.'
};


constants.errors['50010'] = {
	code: 50010,
	description: 'Cache missed'
};

constants.errors['50012'] = {
	code: 50012,
	description: 'Internal error, not able to make a http call.'
};

constants.errors['50015'] = {
	code: 50015,
	'description': 'Internal Database error, a deadlock as occured.'
};

