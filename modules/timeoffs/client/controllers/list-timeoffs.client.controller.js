(function () {
  'use strict';

  angular
    .module('timeoffs')
    .controller('TimeoffsListController', TimeoffsListController);

  TimeoffsListController.$inject = ['TimeoffsService'];

  function TimeoffsListController(TimeoffsService) {
    var vm = this;

    vm.timeoffs = TimeoffsService.query();
  }
}());
