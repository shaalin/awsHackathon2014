'use strict';
/**
 *	Function to map user returned from database
 **/
exports.mapUser = function mapUser(result, queryContext) {
	if (result && result.length) {
		queryContext.result = result[0];
		queryContext.result.properties = [];
		return;
	}
	queryContext.result = null;
};

/**
 *	Function to map user returned from database
 **/
exports.mapUserProperties = function mapUserProperties(result, queryContext) {
	if (result && result.length) {
		for (var i = 0 ; i < result.length; i++){
			console.log(result[i]);
			queryContext.result.properties.push({"name" : result[i].name, "value" : result[i].value});
		}
	}
};