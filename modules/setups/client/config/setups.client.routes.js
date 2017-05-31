(function () {
  'use strict';

  angular
    .module('setups')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('setups', {
        abstract: true,
        url: '/notifications',
        template: '<ui-view/>'
      })
      .state('setups.list', {
        url: '',
        templateUrl: 'modules/setups/client/views/list-setups.client.view.html',
        controller: 'SetupsListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Notification'
        }
      })
      .state('setups.create', {
        url: '/create',
        templateUrl: 'modules/setups/client/views/form-setup.client.view.html',
        controller: 'SetupsController',
        controllerAs: 'vm',
        resolve: {
          setupResolve: newSetup
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Notification Create'
        }
      })
      .state('setups.edit', {
        url: '/:setupId/edit',
        templateUrl: 'modules/setups/client/views/form-setup.client.view.html',
        controller: 'SetupsController',
        controllerAs: 'vm',
        resolve: {
          setupResolve: getSetup
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Edit Notification: {{ setupResolve.name }}'
        }
      })
      .state('setups.view', {
        url: '/:setupId',
        templateUrl: 'modules/setups/client/views/view-setup.client.view.html',
        controller: 'SetupsController',
        controllerAs: 'vm',
        resolve: {
          setupResolve: getSetup
        },
        data: {
          pageTitle: 'Notification {{ setupResolve.name }}'
        }
      });
  }

  getSetup.$inject = ['$stateParams', 'SetupsService'];

  function getSetup($stateParams, SetupsService) {
    return SetupsService.get({
      setupId: $stateParams.setupId
    }).$promise;
  }

  newSetup.$inject = ['SetupsService'];

  function newSetup(SetupsService) {
    return new SetupsService();
  }
}());
