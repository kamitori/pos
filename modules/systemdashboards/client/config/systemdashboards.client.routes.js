(function () {
  'use strict';

  angular
    .module('systemdashboards')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('systemdashboards', {
        abstract: true,
        url: '/systemdashboards',
        template: '<ui-view/>'
      })
      .state('systemdashboards.list', {
        url: '',
        templateUrl: 'modules/systemdashboards/client/views/list-systemdashboards.client.view.html',
        controller: 'SystemdashboardsListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Systemdashboards List'
        }
      })
      .state('systemdashboards.create', {
        url: '/create',
        templateUrl: 'modules/systemdashboards/client/views/form-systemdashboard.client.view.html',
        controller: 'SystemdashboardsController',
        controllerAs: 'vm',
        resolve: {
          systemdashboardResolve: newSystemdashboard
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Systemdashboards Create'
        }
      })
      .state('systemdashboards.edit', {
        url: '/:systemdashboardId/edit',
        templateUrl: 'modules/systemdashboards/client/views/form-systemdashboard.client.view.html',
        controller: 'SystemdashboardsController',
        controllerAs: 'vm',
        resolve: {
          systemdashboardResolve: getSystemdashboard
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Edit Systemdashboard {{ systemdashboardResolve.name }}'
        }
      })
      .state('systemdashboards.view', {
        url: '/:systemdashboardId',
        templateUrl: 'modules/systemdashboards/client/views/view-systemdashboard.client.view.html',
        controller: 'SystemdashboardsController',
        controllerAs: 'vm',
        resolve: {
          systemdashboardResolve: getSystemdashboard
        },
        data: {
          pageTitle: 'Systemdashboard {{ systemdashboardResolve.name }}'
        }
      });
  }

  getSystemdashboard.$inject = ['$stateParams', 'SystemdashboardsService'];

  function getSystemdashboard($stateParams, SystemdashboardsService) {
    return SystemdashboardsService.get({
      systemdashboardId: $stateParams.systemdashboardId
    }).$promise;
  }

  newSystemdashboard.$inject = ['SystemdashboardsService'];

  function newSystemdashboard(SystemdashboardsService) {
    return new SystemdashboardsService();
  }
}());
