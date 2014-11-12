// server.js (Express 4.0)
var express = require('express');
var app = express();

app.use(express.static(__dirname + '/public')); // set the static files location /public/img will be /img for users


app.listen(8080);
console.log('Magic happens on port 8080'); // shoutout to the user