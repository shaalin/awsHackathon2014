var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'Express' });
});

/* GET payment page. */
router.get('/payment', function(req, res) {
  res.render('payment', { title: 'Payment' });
});

module.exports = router;
