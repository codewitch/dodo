//config/passport.js

//init
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;

var User = require('../public/models/user');

var configAuth = require('./auth');

module.exports = function(passport){

  //passport session setup

  //serialize user
  passport.serializeUser(function(user, done) {
    done(null, user.id);
  });

  //deserialize user
  passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
      done(err, user);
    });
  });

  //GOOGLE AUTH SETUP
  passport.use(new GoogleStrategy({
    clientID : configAuth.googleAuth.clientID,
    clientSecret : configAuth.googleAuth.clientSecret,
    callbackURL : configAuth.googleAuth.callbackURL
  }, function(token, refreshToken, profile, done){
    
    process.nextTick(function(){
      //check if user exists
      User.findOne({ 'google.id' : profile.id }, function(err, user){
        if (err)
          return done(err);

        if(user){
          //user exists, so log them in
          return done(null, user);
        }else{
          //create new user and log them in
          var newUser = new User();

          newUser.google.id = profile.id;
          newUser.google.token = token;
          newUser.google.name = profile.displayName;
          newUser.google.email = profile.emails[0].value;

          //save
          newUser.save(function(err){
            if(err)
              throw err;
            return done(null, newUser);
          });
        }
      });
    });
  }));

};
