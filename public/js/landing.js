'user strict'

var dodo = angular.module('dodo', [
  'ngAnimate',
  'ngRoute'
]);

dodo.config(['$routeProvider',
  function($routeProvider) {
      $routeProvider.
        when('/', {
          templateUrl: 'views/templates/landing.html',
          controller: 'landingController'
        }).
        otherwise({
          redirectTo: '/'
        });
  }
]);

dodo.controller('landingController', [
  '$scope', '$timeout',
  function($scope, $timeout) {

  //landing page controller
  $scope.logoShow = false;

  $scope.$on('$viewContentLoaded', function(){
    $timeout(function(){
      $scope.logoShow = true;
    }, 500);
  });

}]);
