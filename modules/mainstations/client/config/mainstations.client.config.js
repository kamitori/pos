(function () {
  'use strict';

  angular
    .module('mainstations')
    .run(menuConfig);

  menuConfig.$inject = ['menuService'];

  function menuConfig(menuService) {
    // Set top bar menu items
    menuService.addMenuItem('topbar', {
      title: 'Mainstations',
      state: 'mainstations',
      type: 'dropdown',
      roles: ['*']
    });

    // Add the dropdown list item
    menuService.addSubMenuItem('topbar', 'mainstations', {
      title: 'List Mainstations',
      state: 'mainstations.list'
    });

    // Add the dropdown create item
    menuService.addSubMenuItem('topbar', 'mainstations', {
      title: 'Create Mainstation',
      state: 'mainstations.create',
      roles: ['user']
    });
  }
}());
