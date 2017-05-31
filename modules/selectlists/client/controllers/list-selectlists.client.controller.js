(function () {
  'use strict';

  angular
    .module('selectlists')
    .controller('SelectlistsListController', SelectlistsListController);

  SelectlistsListController.$inject = ['SelectlistsService'];

  function SelectlistsListController(SelectlistsService) {
    var vm = this;

    vm.selectlists = SelectlistsService.query();
  }
}());
