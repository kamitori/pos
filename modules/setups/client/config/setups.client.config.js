(function () {
  'use strict';

  angular
    .module('setups')
    .run(menuConfig);

  menuConfig.$inject = ['menuService'];

  function menuConfig(menuService) {
    // Set top bar menu items
    menuService.addMenuItem('topbar', {
      title: 'Setups',
      state: 'setups',
      type: 'dropdown',
      roles: ['*']
    });

    // Add the dropdown list item
    menuService.addSubMenuItem('topbar', 'setups', {
      title: 'List Setups',
      state: 'setups.list'
    });

    // Add the dropdown create item
    menuService.addSubMenuItem('topbar', 'setups', {
      title: 'Create Setup',
      state: 'setups.create',
      roles: ['user']
    });
  }
}());
