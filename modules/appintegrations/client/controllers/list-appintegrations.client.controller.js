(function () {
  'use strict';

  angular
    .module('appintegrations')
    .controller('AppintegrationsListController', AppintegrationsListController);

  AppintegrationsListController.$inject = ['$scope', 'AppintegrationsService', 'menuService'];

  function AppintegrationsListController($scope, AppintegrationsService, menuService) {
    var vm = this;
    $scope.changeTitle = menuService.changeTitle;
    $scope.changeTitle('Apps and Integrations');
    vm.appintegrations = AppintegrationsService.query();
  }
}());
