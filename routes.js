//routes.js

//load up todo model
var Todo = require('./public/models/todo');

module.exports = function(app, passport) {

  /**** API ENDPOINTS ***/
  // get all todos
  app.get('/api/todos', isLoggedIn, function(req, res) {
    getTodos(req, res);
  });

  // create or update todo and send back all todos
  app.post('/api/todos', isLoggedIn, function(req, res){
    addOrUpdateTodo(req, res);
  });

  // delete a todo
  app.delete('/api/todos/delete/:todo_id', isLoggedIn, function(req, res){
    deleteTodo(req, res);
  });

  app.get('/api/user', function(req, res){
    if(req.isAuthenticated()){
      res.json({status: true, user: req.user});
    } else {
      res.json({status: "false"});
    }
  });

  /**** PASSPORT ENDPOINTS ****/
  //google
  app.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

  app.get('/auth/google/callback', passport.authenticate('google', {
    successRedirect : '/',
    failureRedirect : '/'
  }));

  //logout
  app.get('/logout', function(req, res){
    req.logout();
    res.redirect('/');
  });

  // application
  app.get('/profile', isLoggedIn, function(req, res){
    res.render('index.html')
  });

  app.get('*', function(req, res){
    if(req.isAuthenticated()){
      res.redirect('/profile');
    }
    res.render('landing.html');
  });

};

function isLoggedIn(req, res, next){
  if(req.isAuthenticated())
    return next();

  res.redirect('/');
}

function filterRequestData(data, user_id){
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

  filteredData.user_id = user_id;

  return filteredData;
}

function getTodos(req, res){
  Todo.find({ user_id: req.user._id }, function(err, todos){
    if (err)
      res.send(err);
    res.json(todos);
  });
}

function addOrUpdateTodo(req, res){
  if (req.body._id){
    //find by id and update
    Todo.findByIdAndUpdate(req.body._id, filterRequestData(req.body, req.user._id),
                                { upsert: true }, function(err, todo) {
      if (err)
        res.send(err);
      //return all todos
      getTodos(req, res);
    });
  }else{
    // create todo
    Todo.create(filterRequestData(req.body, req.user._id), function(err, todo) {
      if (err)
        res.send(err);
      //return all todos
      getTodos(req, res);
    });
  }
};

function deleteTodo(req, res){
  Todo.remove({
    _id : req.params.todo_id,
    user_id : req.user._id
  }, function(err, todo) {
    if (err)
      res.send(err);

    //return all todos
    getTodos(req, res);
  });
}
