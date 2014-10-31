'use strict';

var dodoControllers = angular.module('dodoControllers', ['ngAnimate', 'directive.g+signin']);

dodoControllers.controller('todoController', ['$scope', '$http', function($scope, $http) {
  $scope.formData = {};

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

dodoControllers.controller('landingController', ['$scope', '$timeout', function($scope, $timeout) {
  //landing page controller
  $scope.logoShow = false;

  $scope.$on('$viewContentLoaded', function(){
    $timeout(function(){
      $scope.logoShow = true;
    }, 500);
  });

  //listen for google signin
  $scope.$on('event:google-plus-signin-success', function (event,authResult) {
    // Send login to server or save into cookie
    // create or find user and redirect to todo page
    gapi.client.load('plus', 'v1', function(){
      gapi.client.plus.people.get({userId: 'me'}).execute($scope.handleResponse);
    });
  });

  //handles what happens after signin
  $scope.handleResponse = function(resp) {
    console.log(resp);
    console.log(resp['id']);

    $http.post('/api/user', { google_id: resp['id'] })
        .success(function(data) {
          $scope.todos = data;
          console.log(data);
        })
        .error(function(data) {
          console.log('Error: ' + data);
        });

  };

  $scope.$on('event:google-plus-signin-failure', function (event,authResult) {
    //Auth failure or signout detected
    console.log('event: ' + event);
    console.log('authResult: ' + authResult);
  });

}]);
