//config/auth.js

// expose our config directly to our application using module.exports

module.exports = {
  'googleAuth' : {
    'clientID'        : '68199768281-0qjamjidun2r29jmbingfufep6jbt6ji.apps.googleusercontent.com',
    'clientSecret'    : '0vZKvtMyw4xtdSSxr04ivOQW',
    'callbackURL'     : 'http://localhost:8080/auth/google/callback'
  }
};
