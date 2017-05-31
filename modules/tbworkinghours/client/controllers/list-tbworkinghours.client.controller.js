(function () {
  'use strict';

  angular
    .module('tbworkinghours')
    .controller('TbworkinghoursListController', TbworkinghoursListController);

  TbworkinghoursListController.$inject = ['TbworkinghoursService'];

  function TbworkinghoursListController(TbworkinghoursService) {
    var vm = this;

    vm.tbworkinghours = TbworkinghoursService.query();
  }
}());
