(function () {
  'use strict';

  // Setups controller
  angular
    .module('setups')
    .controller('SetupsController', SetupsController);

  SetupsController.$inject = ['$scope', '$state', '$window', 'Authentication', 'setupResolve'];

  function SetupsController ($scope, $state, $window, Authentication, setup) {
    var vm = this;

    vm.authentication = Authentication;
    vm.setup = setup;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    // Remove existing Setup
    function remove() {
      if ($window.confirm('Are you sure you want to delete?')) {
        vm.setup.$remove($state.go('setups.list'));
      }
    }

    // Save Setup
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.setupForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.setup._id) {
        vm.setup.$update(successCallback, errorCallback);
      } else {
        vm.setup.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('setups.view', {
          setupId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
}());
