(function () {
  'use strict';

  // Appintegrations controller
  angular
    .module('appintegrations')
    .controller('AppintegrationsController', AppintegrationsController);

  AppintegrationsController.$inject = ['$scope', '$state', '$window', 'Authentication', 'appintegrationResolve'];

  function AppintegrationsController ($scope, $state, $window, Authentication, appintegration) {
    var vm = this;

    vm.authentication = Authentication;
    vm.appintegration = appintegration;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    // Remove existing Appintegration
    function remove() {
      if ($window.confirm('Are you sure you want to delete?')) {
        vm.appintegration.$remove($state.go('appintegrations.list'));
      }
    }

    // Save Appintegration
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.appintegrationForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.appintegration._id) {
        vm.appintegration.$update(successCallback, errorCallback);
      } else {
        vm.appintegration.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('appintegrations.view', {
          appintegrationId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
}());
