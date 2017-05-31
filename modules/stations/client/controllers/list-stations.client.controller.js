(function () {
  'use strict';

  angular
    .module('stations')
    .controller('StationsListController', StationsListController);

  StationsListController.$inject = ['$location','StationsService'];

  function StationsListController($location, StationsService) {
    var vm = this;
    var station = $location.hash();
    
    if(station=='kitchen'){
    	vm.title = 'Kitchen Station';
    
    }else if(station=='drink'){
    	vm.title = 'Drink Station';
    
    }else if(station=='order-history'){
    	vm.title = 'Order History';
    
    }else{
    	vm.title = 'Station';
    }

    vm.backlink = '/mainstations';
    vm.pause	= 1;
    vm.search	= 1;
    vm.stations = StationsService.query();
  }
}());
