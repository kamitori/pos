(function () {
  'use strict';

  angular
    .module('adminsystems')
    .run(menuConfig);

  menuConfig.$inject = ['menuService'];

  function menuConfig(menuService) {
    // Set top bar menu items
    menuService.addMenuItem('topbar', {
      title: 'Adminsystems',
      state: 'adminsystems',
      type: 'dropdown',
      roles: ['*']
    });

    // Add the dropdown list item
    menuService.addSubMenuItem('topbar', 'adminsystems', {
      title: 'List Adminsystems',
      state: 'adminsystems.list'
    });

    // Add the dropdown create item
    menuService.addSubMenuItem('topbar', 'adminsystems', {
      title: 'Create Adminsystem',
      state: 'adminsystems.create',
      roles: ['user']
    });
  }
}());
