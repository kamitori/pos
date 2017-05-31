(function () {
  'use strict';

  angular
    .module('selectlists')
    .run(menuConfig);

  menuConfig.$inject = ['menuService'];

  function menuConfig(menuService) {
    // Set top bar menu items
    menuService.addMenuItem('topbar', {
      title: 'Selectlists',
      state: 'selectlists',
      type: 'dropdown',
      roles: ['*']
    });

    // Add the dropdown list item
    menuService.addSubMenuItem('topbar', 'selectlists', {
      title: 'List Selectlists',
      state: 'selectlists.list'
    });

    // Add the dropdown create item
    menuService.addSubMenuItem('topbar', 'selectlists', {
      title: 'Create Selectlist',
      state: 'selectlists.create',
      roles: ['user']
    });
  }
}());
