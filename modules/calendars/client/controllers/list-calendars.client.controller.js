(function () {
  'use strict';

  angular
    .module('calendars')
    .controller('CalendarsListController', CalendarsListController);

  CalendarsListController.$inject = ['$scope', 'CalendarsService', 'menuService'];

  function CalendarsListController($scope, CalendarsService, menuService) {
    var vm = this;

    vm.calendars = CalendarsService.query();
    $scope.changeTitle = menuService.changeTitle;
    $scope.changeTitle('Calendars');

  }
}());
