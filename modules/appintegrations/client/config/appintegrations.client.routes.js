(function () {
  'use strict';

  angular
    .module('appintegrations')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('appintegrations', {
        abstract: true,
        url: '/appintegrations',
        template: '<ui-view/>'
      })
      .state('appintegrations.list', {
        url: '',
        templateUrl: 'modules/appintegrations/client/views/list-appintegrations.client.view.html',
        controller: 'AppintegrationsListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Appintegrations List'
        }
      })
      .state('appintegrations.create', {
        url: '/create',
        templateUrl: 'modules/appintegrations/client/views/form-appintegration.client.view.html',
        controller: 'AppintegrationsController',
        controllerAs: 'vm',
        resolve: {
          appintegrationResolve: newAppintegration
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Appintegrations Create'
        }
      })
      .state('appintegrations.edit', {
        url: '/:appintegrationId/edit',
        templateUrl: 'modules/appintegrations/client/views/form-appintegration.client.view.html',
        controller: 'AppintegrationsController',
        controllerAs: 'vm',
        resolve: {
          appintegrationResolve: getAppintegration
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Edit Appintegration {{ appintegrationResolve.name }}'
        }
      })
      .state('appintegrations.view', {
        url: '/:appintegrationId',
        templateUrl: 'modules/appintegrations/client/views/view-appintegration.client.view.html',
        controller: 'AppintegrationsController',
        controllerAs: 'vm',
        resolve: {
          appintegrationResolve: getAppintegration
        },
        data: {
          pageTitle: 'Appintegration {{ appintegrationResolve.name }}'
        }
      });
  }

  getAppintegration.$inject = ['$stateParams', 'AppintegrationsService'];

  function getAppintegration($stateParams, AppintegrationsService) {
    return AppintegrationsService.get({
      appintegrationId: $stateParams.appintegrationId
    }).$promise;
  }

  newAppintegration.$inject = ['AppintegrationsService'];

  function newAppintegration(AppintegrationsService) {
    return new AppintegrationsService();
  }
}());
