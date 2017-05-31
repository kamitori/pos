(function () {
  'use strict';

  angular
    .module('adminsetups')
    .run(menuConfig);

  menuConfig.$inject = ['menuService'];

  function menuConfig(menuService) {
    // Set top bar menu items
    menuService.addMenuItem('topbar', {
      title: 'Adminsetups',
      state: 'adminsetups',
      type: 'dropdown',
      roles: ['*']
    });

    // Add the dropdown list item
    menuService.addSubMenuItem('topbar', 'adminsetups', {
      title: 'List Adminsetups',
      state: 'adminsetups.list'
    });

    // Add the dropdown create item
    menuService.addSubMenuItem('topbar', 'adminsetups', {
      title: 'Create Adminsetup',
      state: 'adminsetups.create',
      roles: ['user']
    });
  }
}());
