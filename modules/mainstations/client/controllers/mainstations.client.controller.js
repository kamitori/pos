(function () {
  'use strict';

  // Mainstations controller
  angular
    .module('mainstations')
    .controller('MainstationsController', MainstationsController);

  MainstationsController.$inject = ['$scope', '$state', '$window', 'Authentication', 'mainstationResolve'];

  function MainstationsController ($scope, $state, $window, Authentication, mainstation) {
    var vm = this;

    vm.authentication = Authentication;
    vm.mainstation = mainstation;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;
    vm.user = 'Test';

    // Remove existing Mainstation
    function remove() {
      if ($window.confirm('Are you sure you want to delete?')) {
        vm.mainstation.$remove($state.go('mainstations.list'));
      }
    }

    // Save Mainstation
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.mainstationForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.mainstation._id) {
        vm.mainstation.$update(successCallback, errorCallback);
      } else {
        vm.mainstation.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('mainstations.view', {
          mainstationId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
}());
