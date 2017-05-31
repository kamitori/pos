(function () {
  'use strict';

  // Settingsaccounts controller
  angular
    .module('settingsaccounts')
    .controller('SettingsaccountsController', SettingsaccountsController);

  SettingsaccountsController.$inject = ['$scope', '$state', '$window', 'Authentication', 'settingsaccountResolve'];

  function SettingsaccountsController ($scope, $state, $window, Authentication, settingsaccount) {
    var vm = this;

    vm.authentication = Authentication;
    vm.settingsaccount = settingsaccount;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    // Remove existing Settingsaccount
    function remove() {
      if ($window.confirm('Are you sure you want to delete?')) {
        vm.settingsaccount.$remove($state.go('settingsaccounts.list'));
      }
    }

    // Save Settingsaccount
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.settingsaccountForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.settingsaccount._id) {
        vm.settingsaccount.$update(successCallback, errorCallback);
      } else {
        vm.settingsaccount.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('settingsaccounts.view', {
          settingsaccountId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
}());
