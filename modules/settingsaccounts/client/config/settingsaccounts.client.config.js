(function () {
  'use strict';

  angular
    .module('settingsaccounts')
    .run(menuConfig);

  menuConfig.$inject = ['menuService'];

  function menuConfig(menuService) {
    // Set top bar menu items
    menuService.addMenuItem('topbar', {
      title: 'Settingsaccounts',
      state: 'settingsaccounts',
      type: 'dropdown',
      roles: ['*']
    });

    // Add the dropdown list item
    menuService.addSubMenuItem('topbar', 'settingsaccounts', {
      title: 'List Settingsaccounts',
      state: 'settingsaccounts.list'
    });

    // Add the dropdown create item
    menuService.addSubMenuItem('topbar', 'settingsaccounts', {
      title: 'Create Settingsaccount',
      state: 'settingsaccounts.create',
      roles: ['user']
    });
  }
}());
