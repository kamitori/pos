(function () {
  'use strict';

  angular
    .module('systemdashboards')
    .run(menuConfig);

  menuConfig.$inject = ['menuService'];

  function menuConfig(menuService) {
    // Set top bar menu items
    menuService.addMenuItem('topbar', {
      title: 'Systemdashboards',
      state: 'systemdashboards',
      type: 'dropdown',
      roles: ['*']
    });

    // Add the dropdown list item
    menuService.addSubMenuItem('topbar', 'systemdashboards', {
      title: 'List Systemdashboards',
      state: 'systemdashboards.list'
    });

    // Add the dropdown create item
    menuService.addSubMenuItem('topbar', 'systemdashboards', {
      title: 'Create Systemdashboard',
      state: 'systemdashboards.create',
      roles: ['user']
    });
  }
}());
