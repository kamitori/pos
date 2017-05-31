(function () {
  'use strict';

  angular
    .module('adminservices', ['adminservices'])
    .run(menuConfig);

  menuConfig.$inject = ['menuService'];

  function menuConfig(menuService) {
    // Set top bar menu items
    menuService.addMenuItem('topbar', {
      title: 'Services',
      state: 'adminservices',
      type: 'dropdown',
      roles: ['*']
    });

    // Add the dropdown list item
    menuService.addSubMenuItem('topbar', 'adminservices', {
      title: 'List Services',
      state: 'adminservices.list'
    });

    // Add the dropdown create item
    menuService.addSubMenuItem('topbar', 'adminservices', {
      title: 'Create Services',
      state: 'adminservices.create',
      roles: ['user']
    });
  }
}());
