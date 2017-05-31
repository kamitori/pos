(function () {
  'use strict';

  angular
    .module('tbworkinghours')
    .run(menuConfig);

  menuConfig.$inject = ['menuService'];

  function menuConfig(menuService) {
    // Set top bar menu items
    menuService.addMenuItem('topbar', {
      title: 'Tbworkinghours',
      state: 'tbworkinghours',
      type: 'dropdown',
      roles: ['*']
    });

    // Add the dropdown list item
    menuService.addSubMenuItem('topbar', 'tbworkinghours', {
      title: 'List Tbworkinghours',
      state: 'tbworkinghours.list'
    });

    // Add the dropdown create item
    menuService.addSubMenuItem('topbar', 'tbworkinghours', {
      title: 'Create Tbworkinghour',
      state: 'tbworkinghours.create',
      roles: ['user']
    });
  }
}());
