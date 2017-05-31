(function () {
  'use strict';

  angular
    .module('mainstations')
    .controller('MainstationsListController', MainstationsListController);

  MainstationsListController.$inject = ['MainstationsService'];

  function MainstationsListController(MainstationsService) {
    var vm = this;

    vm.mainstations = MainstationsService.query();
    vm.title = 'Main stations';

  }
}());
