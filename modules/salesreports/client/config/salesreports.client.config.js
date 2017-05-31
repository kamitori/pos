(function () {
  'use strict';

  angular
    .module('salesreports')
    .run(menuConfig);

  menuConfig.$inject = ['menuService'];

  function menuConfig(menuService) {
    // Set top bar menu items
    menuService.addMenuItem('topbar', {
      title: 'Salesreports',
      state: 'salesreports',
      type: 'dropdown',
      roles: ['*']
    });

    // Add the dropdown list item
    menuService.addSubMenuItem('topbar', 'salesreports', {
      title: 'List Salesreports',
      state: 'salesreports.list'
    });

    // Add the dropdown create item
    menuService.addSubMenuItem('topbar', 'salesreports', {
      title: 'Create Salesreport',
      state: 'salesreports.create',
      roles: ['user']
    });
  }
}());
