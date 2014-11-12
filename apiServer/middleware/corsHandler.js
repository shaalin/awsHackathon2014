'use strict';
module.exports = function() {

	return function(req, res, next) {
		if (!req.get('Origin')) return next();
		// use "* here to accept any origin
		res.set('Access-Control-Allow-Origin', '*');
		res.set('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH');
		res.set('Access-Control-Allow-Headers', 'X-Requested-With, Content-Type, Authorization');
		// res.set('Access-Control-Allow-Max-Age', 3600);
		if ('OPTIONS' === req.method) return res.send(200);
		next();
	};

};
