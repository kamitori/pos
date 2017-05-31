(function () {
  'use strict';

  // Salesreports controller
  angular
    .module('salesreports')
    .controller('SalesreportsController', SalesreportsController);

  SalesreportsController.$inject = ['$scope', '$state', '$window', 'Authentication', 'salesreportResolve'];

  function SalesreportsController ($scope, $state, $window, Authentication, salesreport) {
    var vm = this;

    vm.authentication = Authentication;
    vm.salesreport = salesreport;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    // Remove existing Salesreport
    function remove() {
      if ($window.confirm('Are you sure you want to delete?')) {
        vm.salesreport.$remove($state.go('salesreports.list'));
      }
    }

    // Save Salesreport
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.salesreportForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.salesreport._id) {
        vm.salesreport.$update(successCallback, errorCallback);
      } else {
        vm.salesreport.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('salesreports.view', {
          salesreportId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
}());
