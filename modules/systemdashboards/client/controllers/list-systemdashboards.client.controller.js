(function () {
  'use strict';

  angular
    .module('systemdashboards')
    .controller('SystemdashboardsListController', SystemdashboardsListController);

  SystemdashboardsListController.$inject = ['SystemdashboardsService'];

  function SystemdashboardsListController(SystemdashboardsService) {
    var vm = this;

    vm.systemdashboards = SystemdashboardsService.query();
  }
}());
