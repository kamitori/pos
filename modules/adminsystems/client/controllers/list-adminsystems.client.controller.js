(function () {
  'use strict';

  angular
    .module('adminsystems')
    .controller('AdminsystemsListController', AdminsystemsListController);

  AdminsystemsListController.$inject = ['AdminsystemsService'];

  function AdminsystemsListController(AdminsystemsService) {
    var vm = this;

    vm.adminsystems = AdminsystemsService.query();
  }
}());
