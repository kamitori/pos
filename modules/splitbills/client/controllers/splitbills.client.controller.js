(function () {
  'use strict';

  // Splitbills controller
  angular
    .module('splitbills')
    .controller('SplitbillsController', SplitbillsController);

  SplitbillsController.$inject = ['$scope', '$state', '$http', '$window', 'Authentication', 'localStorageService', 'ModalService', 'splitbillResolve'];

  function SplitbillsController ($scope, $state, $http, $window, Authentication, localStorageService, ModalService, splitbill) {
    var vm = this;

    vm.authentication = Authentication;
    vm.splitbill = splitbill;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    // Remove existing Splitbill
    function remove() {
      if ($window.confirm('Are you sure you want to delete?')) {
        vm.splitbill.$remove($state.go('splitbills.list'));
      }
    }

    // Save Splitbill
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.splitbillForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.splitbill._id) {
        vm.splitbill.$update(successCallback, errorCallback);
      } else {
        vm.splitbill.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('splitbills.view', {
          splitbillId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
}());
