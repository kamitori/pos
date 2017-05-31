(function () {
  'use strict';

  angular
    .module('staffs')
    .run(menuConfig);

  menuConfig.$inject = ['menuService'];

  function menuConfig(menuService) {
    // Set top bar menu items
    menuService.addMenuItem('topbar', {
      title: 'Staffs',
      state: 'staffs',
      type: 'dropdown',
      roles: ['*']
    });

    // Add the dropdown list item
    menuService.addSubMenuItem('topbar', 'staffs', {
      title: 'List Staffs',
      state: 'staffs.list'
    });

    // Add the dropdown create item
    menuService.addSubMenuItem('topbar', 'staffs', {
      title: 'Create Staff',
      state: 'staffs.create',
      roles: ['user']
    });
  }
}());
