(function () {
  'use strict';

  // Accountplans controller
  angular
    .module('accountplans')
    .controller('AccountplansController', AccountplansController);

  AccountplansController.$inject = ['$scope', '$state', '$window', 'Authentication', 'accountplanResolve'];

  function AccountplansController ($scope, $state, $window, Authentication, accountplan) {
    var vm = this;

    vm.authentication = Authentication;
    vm.accountplan = accountplan;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    // Remove existing Accountplan
    function remove() {
      if ($window.confirm('Are you sure you want to delete?')) {
        vm.accountplan.$remove($state.go('accountplans.list'));
      }
    }

    // Save Accountplan
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.accountplanForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.accountplan._id) {
        vm.accountplan.$update(successCallback, errorCallback);
      } else {
        vm.accountplan.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('accountplans.view', {
          accountplanId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
}());
