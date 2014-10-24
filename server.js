
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
var todoMongo = mongoose.model('Todo', {
  text : String,
  details : String,
  date : Date,
  done : Boolean
});

/**** listen ****/
app.listen(8080);
console.log("App listening on port 8080");

/**** routes ****/

  // api
  // get all todos
  app.get('/api/todos', function(req, res) {

    // use mongoose to get all the todos from the database
    getTodos(req, res);
  });

  // create or update todo and send back all todos
  app.post('/api/todos', function(req, res){
    if (req.body._id){
      //find by id and update
      todoMongo.findByIdAndUpdate(req.body._id, filterRequestData(req.body),
                                  { upsert: true }, function(err, todo) {
        if (err)
          res.send(err);

        //return all todos
        getTodos(req, res);
      });
    }else{
      // create todo
      todoMongo.create(filterRequestData(req.body), function(err, todo) {
        if (err)
          res.send(err);

        //return all todos
        getTodos(req, res);
      });
    }
  });

  // delete a todo
  app.delete('/api/todos/delete/:todo_id', function(req, res){
    todoMongo.remove({
      _id : req.params.todo_id
    }, function(err, todo) {
      if (err)
        res.send(err);

      //return all todos
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
