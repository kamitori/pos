(function () {
  'use strict';

  // Staffs controller
  angular
    .module('staffs')
    .controller('StaffsController', StaffsController);

  StaffsController.$inject = ['$scope', '$state', '$window', 'Authentication', 'staffResolve'];

  function StaffsController ($scope, $state, $window, Authentication, staff) {
    var vm = this;

    vm.authentication = Authentication;
    vm.staff = staff;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;
    // Remove existing Staff
    function remove() {
      if ($window.confirm('Are you sure you want to delete?')) {
        vm.staff.$remove($state.go('staffs.list'));
      }
    }

    // Save Staff
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.staffForm');
        return false;
      }

      function successCallback(res) {
        $state.go('staffs.view', {
          staffId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
}());
