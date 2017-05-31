(function () {
  'use strict';

  angular
    .module('adminsetups')
    .controller('AdminsetupsListController', AdminsetupsListController);

  AdminsetupsListController.$inject = ['AdminsetupsService'];

  function AdminsetupsListController(AdminsetupsService) {
    var vm = this;

    vm.adminsetups = AdminsetupsService.query();
  }
}());
