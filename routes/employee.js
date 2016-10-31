var Cloudant=require('Cloudant')('https://c2b63935-ccc2-452a-bcff-d5c131fb56c9-bluemix.cloudant.com/employee_directive/63f385a68c7c41bfff98c91fecd85c63');
    //'https://c2b63935-ccc2-452a-bcff-d5c131fb56c9-bluemix.cloudant.com/dashboard.html#/database/employee_directive/63f385a68c7c41bfff98c91fecd85c63');
//var nano = require('nano')('https://c2b63935-ccc2-452a-bcff-d5c131fb56c9-bluemix.cloudant.com/dashboard.html#/database/employee_directive/63f385a68c7c41bfff98c91fecd85c63');
var cloudant=Cloudant;



var ts;
var cfenv = require('cfenv');
var appEnv = cfenv.getAppEnv();
var dbCredssecurityquestions =  appEnv.getServiceCreds('employee_directive');
//var websiteTitle = require('./websitetitle');

if (dbCredssecurityquestions) {
	console.log('Using Bluemix(CB) DB URL is ' + dbCredssecurityquestions.url);
	//nano = require('nano')(dbCreds.url);
	ts = cloudant.use('employee_directive');
} else {
//Use local
ts = cloudant.use('employee_directive');
	console.log('local employee_directive DB!');
}


exports.findAllQuestions = function(req, res) {
ts.list({include_docs:true}, function(error, body, headers) {
    console.log("Error:", error); 
    console.log("Data:", body);
    res.send(body);
         
    });
};
