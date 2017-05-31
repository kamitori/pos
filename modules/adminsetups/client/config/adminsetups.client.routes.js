(function () {
  'use strict';

  angular
    .module('adminsetups')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('adminsetups', {
        abstract: true,
        url: '/adminsetups',
        template: '<ui-view/>'
      })
      .state('adminsetups.list', {
        url: '',
        templateUrl: 'modules/adminsetups/client/views/list-adminsetups.client.view.html',
        controller: 'AdminsetupsListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Adminsetups List'
        }
      })
      .state('adminsetups.create', {
        url: '/create',
        templateUrl: 'modules/adminsetups/client/views/form-adminsetup.client.view.html',
        controller: 'AdminsetupsController',
        controllerAs: 'vm',
        resolve: {
          adminsetupResolve: newAdminsetup
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Adminsetups Create'
        }
      })
      .state('adminsetups.edit', {
        url: '/:adminsetupId/edit',
        templateUrl: 'modules/adminsetups/client/views/form-adminsetup.client.view.html',
        controller: 'AdminsetupsController',
        controllerAs: 'vm',
        resolve: {
          adminsetupResolve: getAdminsetup
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Edit Adminsetup {{ adminsetupResolve.name }}'
        }
      })
      .state('adminsetups.view', {
        url: '/:adminsetupId',
        templateUrl: 'modules/adminsetups/client/views/view-adminsetup.client.view.html',
        controller: 'AdminsetupsController',
        controllerAs: 'vm',
        resolve: {
          adminsetupResolve: getAdminsetup
        },
        data: {
          pageTitle: 'Adminsetup {{ adminsetupResolve.name }}'
        }
      });
  }

  getAdminsetup.$inject = ['$stateParams', 'AdminsetupsService'];

  function getAdminsetup($stateParams, AdminsetupsService) {
    return AdminsetupsService.get({
      adminsetupId: $stateParams.adminsetupId
    }).$promise;
  }

  newAdminsetup.$inject = ['AdminsetupsService'];

  function newAdminsetup(AdminsetupsService) {
    return new AdminsetupsService();
  }
}());
