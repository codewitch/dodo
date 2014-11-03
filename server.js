/**** dependencies set up ****/
var express = require('express');
var app = express();                            // create app with express
var port = process.env.PORT || 8080;
var mongoose = require('mongoose');             // mongoose for mongodb
var morgan = require('morgan');                  // log requests to console
var bodyParser = require('body-parser');        // pul information from HTML POSt
var methodOverride = require('method-override');// simulate DELETE and PUT

var passport = require('passport');
var flash    = require('connect-flash');
var cookieParser = require('cookie-parser');
var session      = require('express-session');

var configDB = require('./config/database.js');


/*** configuration ****/
mongoose.connect(configDB.url);

require('./config/passport')(passport); // pass passport for configuration

//set up our express application
app.use(express.static(__dirname + '/public')); //sets static files to the /public directory
app.set('views', __dirname + '/public/views');
app.use(morgan('dev')); //log every request to the console
app.use(cookieParser()); //read cookies (needed for auth)
app.use(bodyParser.urlencoded({'extended': 'true'}));
app.use(bodyParser.json());
app.use(bodyParser.json({ type: 'application/vnd.api+json' }));
app.use(bodyParser()); //get information from html forms
app.use(methodOverride());

app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

// required for passport
app.use(session({ secret: 'dodomytodos'})); //session secret
app.use(passport.initialize());
app.use(passport.session()); //persistent login sessions
app.use(flash()); //use connect-flash for flash messages stored in session

/**** routes ****/
require('./routes.js')(app, passport); // load our routes and pass in our app and fully configured passport

/**** listen ****/
app.listen(port, function() {
  console.log("Node app is running at localhost:" + port);
});
