(function () {
  'use strict';

  angular
    .module('stations')
    .run(menuConfig);

  menuConfig.$inject = ['menuService'];

  function menuConfig(menuService) {
    // Set top bar menu items
    menuService.addMenuItem('topbar', {
      title: 'Stations',
      state: 'stations',
      type: 'dropdown',
      roles: ['*']
    });

    // Add the dropdown list item
    menuService.addSubMenuItem('topbar', 'stations', {
      title: 'List Stations',
      state: 'stations.list'
    });

    // Add the dropdown create item
    menuService.addSubMenuItem('topbar', 'stations', {
      title: 'Create Station',
      state: 'stations.create',
      roles: ['user']
    });
  }
}());
