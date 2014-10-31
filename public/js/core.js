'user strict'

var dodo = angular.module('dodo', [
  'dodoControllers',
  'ngRoute'
]);

dodo.config(['$routeProvider',
  function($routeProvider) {
      $routeProvider.
        when('/', {
          templateUrl: 'templates/landing.html',
          controller: 'landingController'
        }).
        when('/:userId', {
          templateUrl: 'templates/todo-list.html',
          controller: 'todoController'
        }).
        otherwise({
          redirectTo: '/'
        });
  }
]);

