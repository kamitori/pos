(function () {
  'use strict';

  angular
    .module('core')
    .controller('HomeController', HomeController);

  HomeController.$inject = ['$scope', '$state', 'localStorageService'];

  function HomeController($scope, $state, localStorageService) {
    var vm = this;
    console.log(user);
    if(user == null){
    	$state.go('authentication.signin'); 
    }else{
      if(!localStorageService.get('user')){
        localStorageService.set('user', user);
      }
      if(user.company._id){
        $state.go('mainstations.list');  
      }else{
        $state.go('restaurants.list');  
      }
    }
  }
}());
