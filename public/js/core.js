'user strict';

var dodo = angular.module('dodo', [
  'dodoControllers',
  'ngRoute'
]);

dodo.config(['$routeProvider',
  function($routeProvider) {
      $routeProvider.
        when('/', {
          templateUrl: 'views/templates/todo-list.html',
          controller: 'todoController'
        }).
        otherwise({
          redirectTo: '/'
        });
  }
]);

