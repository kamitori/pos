(function () {
  'use strict';

  angular
    .module('adminsystems')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('adminsystems', {
        abstract: true,
        url: '/adminsystems',
        template: '<ui-view/>'
      })
      .state('adminsystems.list', {
        url: '',
        templateUrl: 'modules/adminsystems/client/views/list-adminsystems.client.view.html',
        controller: 'AdminsystemsListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Adminsystems List'
        }
      })
      .state('adminsystems.create', {
        url: '/create',
        templateUrl: 'modules/adminsystems/client/views/form-adminsystem.client.view.html',
        controller: 'AdminsystemsController',
        controllerAs: 'vm',
        resolve: {
          adminsystemResolve: newAdminsystem
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Adminsystems Create'
        }
      })
      .state('adminsystems.edit', {
        url: '/:adminsystemId/edit',
        templateUrl: 'modules/adminsystems/client/views/form-adminsystem.client.view.html',
        controller: 'AdminsystemsController',
        controllerAs: 'vm',
        resolve: {
          adminsystemResolve: getAdminsystem
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Edit Adminsystem {{ adminsystemResolve.name }}'
        }
      })
      .state('adminsystems.view', {
        url: '/:adminsystemId',
        templateUrl: 'modules/adminsystems/client/views/view-adminsystem.client.view.html',
        controller: 'AdminsystemsController',
        controllerAs: 'vm',
        resolve: {
          adminsystemResolve: getAdminsystem
        },
        data: {
          pageTitle: 'Adminsystem {{ adminsystemResolve.name }}'
        }
      });
  }

  getAdminsystem.$inject = ['$stateParams', 'AdminsystemsService'];

  function getAdminsystem($stateParams, AdminsystemsService) {
    return AdminsystemsService.get({
      adminsystemId: $stateParams.adminsystemId
    }).$promise;
  }

  newAdminsystem.$inject = ['AdminsystemsService'];

  function newAdminsystem(AdminsystemsService) {
    return new AdminsystemsService();
  }
}());
