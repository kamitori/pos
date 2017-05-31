(function () {
  'use strict';

  // Timeoffs controller
  angular
    .module('timeoffs')
    .controller('TimeoffsController', TimeoffsController);

  TimeoffsController.$inject = ['$scope', '$state', '$window', 'Authentication', 'timeoffResolve'];

  function TimeoffsController ($scope, $state, $window, Authentication, timeoff) {
    var vm = this;

    vm.authentication = Authentication;
    vm.timeoff = timeoff;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    // Remove existing Timeoff
    function remove() {
      if ($window.confirm('Are you sure you want to delete?')) {
        vm.timeoff.$remove($state.go('timeoffs.list'));
      }
    }

    // Save Timeoff
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.timeoffForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.timeoff._id) {
        vm.timeoff.$update(successCallback, errorCallback);
      } else {
        vm.timeoff.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('timeoffs.view', {
          timeoffId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
}());
