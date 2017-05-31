(function () {
  'use strict';

  angular
    .module('adminservices')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('adminservices', {
        abstract: true,
        url: '/services',
        template: '<ui-view/>'
      })
      .state('adminservices.list', {
        url: '',
        templateUrl: 'modules/adminservices/client/views/list-adminservices.client.view.html',
        controller: 'AdminservicesListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Service List'
        }
      })
      .state('adminservices.create', {
        url: '/create',
        templateUrl: 'modules/adminservices/client/views/form-adminservice.client.view.html',
        controller: 'AdminservicesController',
        controllerAs: 'vm',
        resolve: {
          adminserviceResolve: newAdminservice
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Service Create'
        }
      })
      .state('adminservices.edit', {
        url: '/:adminserviceId/edit',
        templateUrl: 'modules/adminservices/client/views/form-adminservice.client.view.html',
        controller: 'AdminservicesController',
        controllerAs: 'vm',
        resolve: {
          adminserviceResolve: getAdminservice
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Edit Service {{ adminserviceResolve.name }}'
        }
      })
      .state('adminservices.view', {
        url: '/:adminserviceId',
        templateUrl: 'modules/adminservices/client/views/view-adminservice.client.view.html',
        controller: 'AdminservicesController',
        controllerAs: 'vm',
        resolve: {
          adminserviceResolve: getAdminservice
        },
        data: {
          pageTitle: 'Service {{ adminserviceResolve.name }}'
        }
      });
  }

  getAdminservice.$inject = ['$stateParams', 'AdminservicesService'];

  function getAdminservice($stateParams, AdminservicesService) {
    return AdminservicesService.get({
      adminserviceId: $stateParams.adminserviceId
    }).$promise;
  }

  newAdminservice.$inject = ['AdminservicesService'];

  function newAdminservice(AdminservicesService) {
    return new AdminservicesService();
  }
}());
