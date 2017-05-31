(function () {
  'use strict';

  // Tbworkinghours controller
  angular
    .module('tbworkinghours')
    .controller('TbworkinghoursController', TbworkinghoursController);

  TbworkinghoursController.$inject = ['$scope', '$state', '$window', 'Authentication', 'tbworkinghourResolve'];

  function TbworkinghoursController ($scope, $state, $window, Authentication, tbworkinghour) {
    var vm = this;

    vm.authentication = Authentication;
    vm.tbworkinghour = tbworkinghour;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    // Remove existing Tbworkinghour
    function remove() {
      if ($window.confirm('Are you sure you want to delete?')) {
        vm.tbworkinghour.$remove($state.go('tbworkinghours.list'));
      }
    }

    // Save Tbworkinghour
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.tbworkinghourForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.tbworkinghour._id) {
        vm.tbworkinghour.$update(successCallback, errorCallback);
      } else {
        vm.tbworkinghour.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('tbworkinghours.view', {
          tbworkinghourId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
}());
