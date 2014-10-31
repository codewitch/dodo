/**** dependencies set up ****/
var express = require('express');
var app = express();                            // create app with express
var mongoose = require('mongoose');             // mongoose for mongodb
var morgan = require('morgan');                  // log requests to console
var bodyParser = require('body-parser');        // pul information from HTML POSt
var methodOverride = require('method-override');// simulate DELETE and PUT

/*** configuration ****/
mongoose.connect('mongodb://dodo-admin:fFZmGT3KHkfg7T@ds035270.mongolab.com:35270/dodo');

app.use(express.static(__dirname + '/public')); //sets static files to the /public directory
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({'extended': 'true'}));
app.use(bodyParser.json());
app.use(bodyParser.json({ type: 'application/vnd.api+json' }));
app.use(methodOverride());

/**** define model ****/
var userMongo = mongoose.model('User', {
  google_id : String
});
var todoMongo = mongoose.model('Todo', {
  text : String,
  details : String,
  date : Date,
  user_id : Number,
  done : Boolean
});

/**** listen ****/
//app.listen(8080);
app.set('port', (process.env.PORT || 8080));
app.listen(app.get('port'), function() {
  console.log("Node app is running at localhost:" + app.get('port'))
});

/**** routes ****/

  // endpoints
  // get all todos
  app.get('/api/todos', function(req, res) {
    getTodos(req, res);
  });

  // create or update todo and send back all todos
  app.post('/api/todos', function(req, res){
    addOrUpdateTodo(req, res);
  });

  // delete a todo
  app.delete('/api/todos/delete/:todo_id', function(req, res){
    deleteTodo(req, res);
  });

  //create or sign in user
  app.post('/api/user', function(req, res){
    //lookup google id to see if user exists
    googleId = req.body.google_id;
    todoMongo.findOne({ google_id: googleId }, function(err, User){
      if(err)
        res.send(err);

      if(User){
        //User exists
      }else{
        //Create new user
        User = createNewUser(googleId);
      }

      //change this so it only gets your todos
      getTodos(req, res);
    });
  });

  // application
  app.get('*', function(req, res){
    res.sendfile('./public/index.html');
  });

function filterRequestData(data){
  filteredData = {};
  if( "text" in data ){
    filteredData.text = data.text;
  }
  if( "details" in data ){
    filteredData.details = data.details;
  }
  if( "date" in data ){
    filteredData.date = data.date;
  }
  if( "done" in data ){
    filteredData.done = data.done;
  }else{
    filteredData.done = false;
  }

  return filteredData;
}

function getTodos(req, res){
  todoMongo.find(function(err, todos){
    if (err)
      res.send(err);
    res.json(todos);
  });
}

function addOrUpdateTodo(req, res){
  if (req.body._id){
    //find by id and update
    todoMongo.findByIdAndUpdate(req.body._id, filterRequestData(req.body),
                                { upsert: true }, function(err, todo) {
      if (err)
        res.send(err);
    });
  }else{
    // create todo
    todoMongo.create(filterRequestData(req.body), function(err, todo) {
      if (err)
        res.send(err);
    });
  }
  //return all todos
  getTodos(req, res);
};

function deleteTodo(req, res){
  todoMongo.remove({
    _id : req.params.todo_id
  }, function(err, todo) {
    if (err)
      res.send(err);

    //return all todos
    getTodos(req, res);
  });
}

function createNewUser(googleId){
  //todo: auto increment user_id and make it unique
  todoMongo.create({
    "google_id" : googleId
  }, function(err, user) {
    if (err)
      return err;
    return user;
  });
}
