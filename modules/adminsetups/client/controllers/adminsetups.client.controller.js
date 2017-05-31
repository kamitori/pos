(function () {
  'use strict';

  // Adminsetups controller
  angular
    .module('adminsetups')
    .controller('AdminsetupsController', AdminsetupsController);

  AdminsetupsController.$inject = ['$scope', '$state', '$window', 'Authentication', 'adminsetupResolve'];

  function AdminsetupsController ($scope, $state, $window, Authentication, adminsetup) {
    var vm = this;

    vm.authentication = Authentication;
    vm.adminsetup = adminsetup;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    // Remove existing Adminsetup
    function remove() {
      if ($window.confirm('Are you sure you want to delete?')) {
        vm.adminsetup.$remove($state.go('adminsetups.list'));
      }
    }

    // Save Adminsetup
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.adminsetupForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.adminsetup._id) {
        vm.adminsetup.$update(successCallback, errorCallback);
      } else {
        vm.adminsetup.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('adminsetups.view', {
          adminsetupId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
}());
