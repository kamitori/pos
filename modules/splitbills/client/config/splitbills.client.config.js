(function () {
  'use strict';

  angular
    .module('splitbills')
    .run(menuConfig);

  menuConfig.$inject = ['menuService'];

  function menuConfig(menuService) {
    // Set top bar menu items
    menuService.addMenuItem('topbar', {
      title: 'Splitbills',
      state: 'splitbills',
      type: 'dropdown',
      roles: ['*']
    });

    // Add the dropdown list item
    menuService.addSubMenuItem('topbar', 'splitbills', {
      title: 'List Splitbills',
      state: 'splitbills.list'
    });

    // Add the dropdown create item
    menuService.addSubMenuItem('topbar', 'splitbills', {
      title: 'Create Splitbill',
      state: 'splitbills.create',
      roles: ['user']
    });
  }
}());
