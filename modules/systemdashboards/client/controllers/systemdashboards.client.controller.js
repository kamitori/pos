(function () {
  'use strict';

  // Systemdashboards controller
  angular
    .module('systemdashboards')
    .controller('SystemdashboardsController', SystemdashboardsController);

  SystemdashboardsController.$inject = ['$scope', '$state', '$window', 'Authentication', 'systemdashboardResolve'];

  function SystemdashboardsController ($scope, $state, $window, Authentication, systemdashboard) {
    var vm = this;

    vm.authentication = Authentication;
    vm.systemdashboard = systemdashboard;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    // Remove existing Systemdashboard
    function remove() {
      if ($window.confirm('Are you sure you want to delete?')) {
        vm.systemdashboard.$remove($state.go('systemdashboards.list'));
      }
    }

    // Save Systemdashboard
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.systemdashboardForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.systemdashboard._id) {
        vm.systemdashboard.$update(successCallback, errorCallback);
      } else {
        vm.systemdashboard.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('systemdashboards.view', {
          systemdashboardId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
}());
