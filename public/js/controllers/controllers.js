'use strict';

var dodoControllers = angular.module('dodoControllers', ['ngAnimate', 'inputDirectives']);

dodoControllers.controller('todoController', ['$scope', '$http', function($scope, $http) {
  $scope.formData = {};

  $(function() {
    $(".due-date-input").datepicker();
  });

  $http.get('/api/todos')
      .success(function(data) {
        $scope.todos = data;
        console.log(data);
      })
      .error(function(data) {
        console.log('Error: ' + data);
      });

  // when submitting the add form, send the text to the node API
  $scope.createTodo = function() {
    $http.post('/api/todos', $scope.formData)
        .success(function(data) {
          $scope.formData = {}; // clear the form for the next 
          $scope.todos = data;
          console.log(data);
        })
        .error(function(data) {
          console.log('Error: ' + data);
        });
  };

  // update a todo item
  $scope.updateTodo = function(todo) {
    $http.post('/api/todos', todo)
        .success(function(data) {
          $scope.todos = data;
          console.log(data);
        })
        .error(function(data) {
          console.log('Error: ' + data);
        });
  };

  // delete a todo
  $scope.deleteTodo = function(id) {
    $http.delete('/api/todos/delete/' + id)
        .success(function(data) {
          $scope.todos = data;
          console.log(data);
        })
        .error(function(data){
          console.log('Error: ' + data);
        });
  };

  //ANIMATIONS, MAYBE RECFACTOR INTO SEPARTE MODULE
}]);
