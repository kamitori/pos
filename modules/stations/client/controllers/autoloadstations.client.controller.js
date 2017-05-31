(function () {
  'use strict';

  angular
    .module('stations')
    .controller('AutoloadstationController', AutoloadstationController);

  AutoloadstationController.$inject = ['StationsService'];

  function AutoloadstationController(StationsService) {
    var vm = this;

    vm.stations = StationsService.query();
  }
}());
