// public/models/todo.js
// load the things we need
var mongoose = require('mongoose');

// define the schema for our todo model
var todoSchema = mongoose.Schema({
  text : String,
  details : String,
  date : Date,
  user_id : String,
  done : Boolean
});

// methods ======================

// create the model for todos and expose it to our app
module.exports = mongoose.model('Todo', todoSchema);
