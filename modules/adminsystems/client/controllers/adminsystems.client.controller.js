(function () {
  'use strict';

  // Adminsystems controller
  angular
    .module('adminsystems')
    .controller('AdminsystemsController', AdminsystemsController);

  AdminsystemsController.$inject = ['$scope', '$state', '$window', 'Authentication', 'adminsystemResolve'];

  function AdminsystemsController ($scope, $state, $window, Authentication, adminsystem) {
    var vm = this;

    vm.authentication = Authentication;
    vm.adminsystem = adminsystem;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    // Remove existing Adminsystem
    function remove() {
      if ($window.confirm('Are you sure you want to delete?')) {
        vm.adminsystem.$remove($state.go('adminsystems.list'));
      }
    }

    // Save Adminsystem
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.adminsystemForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.adminsystem._id) {
        vm.adminsystem.$update(successCallback, errorCallback);
      } else {
        vm.adminsystem.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('adminsystems.view', {
          adminsystemId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
}());
