(function () {
  'use strict';

  angular
    .module('restaurants')
    .controller('RestaurantsListController', RestaurantsListController);

  RestaurantsListController.$inject = ['RestaurantsService', '$state', 'localStorageService'];

  function RestaurantsListController(RestaurantsService, $state, localStorageService) {
    var vm = this;
    vm.companyList = user.company_list;
    vm.user = localStorageService.get('user') || user;
    vm.restaurants = RestaurantsService.getListRestaurantInArray({ companyListRestaurant: vm.companyList});
    vm.setCompany = function(restaurant) {
      vm.user.company = restaurant;
      localStorageService.set('user',vm.user);
      console.log('Session: ', localStorageService.get('user'));
      $state.go('mainstations.list');
    }
  }
}());
