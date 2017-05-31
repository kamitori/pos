(function () {
  'use strict';

  // Stations controller
  angular
    .module('stations')
    .controller('StationsController', StationsController);

  StationsController.$inject = ['$scope', '$state', '$window', 'Authentication', 'stationResolve'];

  function StationsController ($scope, $state, $window, Authentication, station) {
    var vm = this;

    vm.authentication = Authentication;
    vm.station = station;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    // Remove existing Station
    function remove() {
      if ($window.confirm('Are you sure you want to delete?')) {
        vm.station.$remove($state.go('stations.list'));
      }
    }

    // Save Station
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.stationForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.station._id) {
        vm.station.$update(successCallback, errorCallback);
      } else {
        vm.station.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('stations.view', {
          stationId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
}());
