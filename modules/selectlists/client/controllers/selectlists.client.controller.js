(function () {
  'use strict';

  // Selectlists controller
  angular
    .module('selectlists')
    .controller('SelectlistsController', SelectlistsController);

  SelectlistsController.$inject = ['$scope', '$state', '$window', 'Authentication', 'selectlistResolve'];

  function SelectlistsController ($scope, $state, $window, Authentication, selectlist) {
    var vm = this;

    vm.authentication = Authentication;
    vm.selectlist = selectlist;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    // Remove existing Selectlist
    function remove() {
      if ($window.confirm('Are you sure you want to delete?')) {
        vm.selectlist.$remove($state.go('selectlists.list'));
      }
    }

    // Save Selectlist
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.selectlistForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.selectlist._id) {
        vm.selectlist.$update(successCallback, errorCallback);
      } else {
        vm.selectlist.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('selectlists.view', {
          selectlistId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
}());
