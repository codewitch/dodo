//routes.js

//load up todo model
var Todo = require('./public/models/todo');

module.exports = function(app, passport) {

  /**** API ENDPOINTS ***/
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

  /**** PASSPORT ENDPOINTS ****/


  // application
  app.get('*', function(req, res){
    res.sendfile('./public/index.html');
  });

};

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
  Todo.find(function(err, todos){
    if (err)
      res.send(err);
    res.json(todos);
  });
}

function addOrUpdateTodo(req, res){
  if (req.body._id){
    //find by id and update
    Todo.findByIdAndUpdate(req.body._id, filterRequestData(req.body),
                                { upsert: true }, function(err, todo) {
      if (err)
        res.send(err);
    });
  }else{
    // create todo
    Todo.create(filterRequestData(req.body), function(err, todo) {
      if (err)
        res.send(err);
    });
  }
  //return all todos
  getTodos(req, res);
};

function deleteTodo(req, res){
  Todo.remove({
    _id : req.params.todo_id
  }, function(err, todo) {
    if (err)
      res.send(err);

    //return all todos
    getTodos(req, res);
  });
}
