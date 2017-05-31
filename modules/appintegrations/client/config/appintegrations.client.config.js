(function () {
  'use strict';

  angular
    .module('appintegrations')
    .run(menuConfig);

  menuConfig.$inject = ['menuService'];

  function menuConfig(menuService) {
    // Set top bar menu items
    menuService.addMenuItem('topbar', {
      title: 'Apps and integrations',
      state: 'appintegrations',
      type: 'dropdown',
      roles: ['*']
    });

    // Add the dropdown list item
    menuService.addSubMenuItem('topbar', 'appintegrations', {
      title: 'Apps and integrations',
      state: 'appintegrations.list'
    });

    // Add the dropdown create item
    menuService.addSubMenuItem('topbar', 'appintegrations', {
      title: 'Apps and integrations',
      state: 'appintegrations.create',
      roles: ['user']
    });
  }
}());
