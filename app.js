var express = require('express');
var path =require('path');
var passport = require('passport');
var cookieParser = require('cookie-parser');
var session = require('express-session');

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
app.use(express.static(path.join(__dirname, '/routes')));
// get the app environment from Cloud Foundry
var appEnv = cfenv.getAppEnv();

app.use(bodyParser.json());
var port = (process.env.VCAP_APP_PORT || 3000);
var host = (process.env.VCAP_APP_HOST || 'localhost');

// start server on the specified port and binding host
app.use(cookieParser())
 //new line *****
//app.use(cookieParser());
app.use(session({resave: 'true', saveUninitialized: 'true' , secret: 'keyboard cat'}));
app.use(passport.initialize());
app.use(passport.session()); 
//
//
passport.serializeUser(function(user, done) {
   done(null, user);
}); 

passport.deserializeUser(function(obj, done) {
   done(null, obj);
});         

// VCAP_SERVICES contains all the credentials of services bound to
// this application. For details of its content, please refer to
// the document or sample of each service.  
var services = JSON.parse(process.env.VCAP_SERVICES || "{}");
console.log("***",services.SingleSignOn);
var ssoConfig = services.SingleSignOn[0]; 
var client_id = ssoConfig.credentials.clientId;
var client_secret = ssoConfig.credentials.secret;
var authorization_url = ssoConfig.credentials.authorizationEndpointUrl;
var token_url = ssoConfig.credentials.tokenEndpointUrl;
var issuer_id = ssoConfig.credentials.issuerIdentifier;
var callback_url = 'https://AndaLoginDemo.mybluemix.net/auth/sso/callback';        

var OpenIDConnectStrategy = require('passport-idaas-openidconnect').IDaaSOIDCStrategy;
var Strategy = new OpenIDConnectStrategy({
                 authorizationURL : authorization_url,
                 tokenURL : token_url,
                 clientID : client_id,
                 scope: 'openid',
                 response_type: 'code',
                 clientSecret : client_secret,
                 callbackURL : callback_url,
                 skipUserProfile: true,
                 issuer: issuer_id}, 
	function(iss, sub, profile, accessToken, refreshToken, params, done)  {
	         	process.nextTick(function() {
		profile.accessToken = accessToken;
		profile.refreshToken = refreshToken;
		done(null, profile);
         	})
}); 
var employeeser = require('./routes/employee');

appem.get('/getemps', employeeser.findAllQuestions);
passport.use(Strategy); 
app.get('/login', passport.authenticate('openidconnect', {})); 
          
function ensureAuthenticated(req, res, next) {
	if(!req.isAuthenticated()) {
	          	req.session.originalUrl = req.originalUrl;
		res.redirect('/login');
	} else {
		return next();
	}
}
 app.get('/test', ensureAuthenticated, function(req, res){
       res.render('mytable', {});
 });
 //second add line
 app.get('/auth/sso/callback',function(req,res,next) {               
             var redirect_url = req.session.originalUrl;                
             passport.authenticate('openidconnect', {
                     successRedirect: redirect_url,                                
                     failureRedirect: '/failure',                        
          })(req,res,next);
        });

 //
 app.get('/failure', function(req, res) { 
             res.send('login failed'); });

//---
app.get('/home', function(req, res){
	res.render('mytable', {});
	
});
app.get('/question', function(req, res){
	res.render('suryqs', {});
	
});
//start server on the specified port and binding hostnew
app.listen(appEnv.port, host, function() {
  // print a message when the server starts listening
  console.log("server starting on " + appEnv.url);
});
