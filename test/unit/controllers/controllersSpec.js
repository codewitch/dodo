describe('Dodo App Controllers', function(){
  describe('todoController', function(){
    var scope, ctrl;

    beforeEach(module('dodo'));

    beforeEach(inject(function($controller){
      scope = {};
      ctrl = $controller('todoController', {$scope:scope, $http:http});
    }));

    it('should do something', inject(function($controller){
      //example:
      //expect(scope.scope.length).toBe(3);
    }));
  });
});
