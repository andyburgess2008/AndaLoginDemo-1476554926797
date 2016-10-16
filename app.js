/*eslint-env node*/

//------------------------------------------------------------------------------
// node.js starter application for Bluemix
//------------------------------------------------------------------------------

// This application uses express as its web server
// for more info, see: http://expressjs.com
var express = require('express');
var path =require('path');
// cfenv provides access to your Cloud Foundry environment
// for more info, see: https://www.npmjs.com/package/cfenv
var cfenv = require('cfenv');
var bodyParser =require('body-parser');

// create a new express server
var app = express();


app.set('view engine', 'ejs');
//app.set('views', __dirname+ '/views');
app.set('views', path.join(__dirname, 'views'));

// serve the files out of ./public as our main files
app.use(express.static(__dirname + '/public'));

// get the app environment from Cloud Foundry
var appEnv = cfenv.getAppEnv();

app.use(bodyParser.json());
var port = (process.env.VCAP_APP_PORT || 3000);
var host = (process.env.VCAP_APP_HOST || 'localhost');

app.get('/home', function(req, res){
	res.render('mytable', {});
	
});
//start server on the specified port and binding hostnew
app.listen(appEnv.port, host, function() {
  // print a message when the server starts listening
  console.log("server starting on " + appEnv.url);
});
// start server on the specified port and binding host
/*
app.listen(appEnv.port, '0.0.0.0', function() {
  // print a message when the server starts listening
  console.log("server starting on " + appEnv.url);
});*/
