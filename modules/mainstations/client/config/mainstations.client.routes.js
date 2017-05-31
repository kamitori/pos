(function () {
  'use strict';

  angular
    .module('mainstations')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('mainstations', {
        abstract: true,
        url: '/mainstations',
        template: '<ui-view/>'
      })
      .state('mainstations.list', {
        url: '',
        templateUrl: 'modules/mainstations/client/views/list-mainstations.client.view.html',
        controller: 'MainstationsListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Mainstations List'
        }
      })
      .state('mainstations.create', {
        url: '/create',
        templateUrl: 'modules/mainstations/client/views/form-mainstation.client.view.html',
        controller: 'MainstationsController',
        controllerAs: 'vm',
        resolve: {
          mainstationResolve: newMainstation
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Mainstations Create'
        }
      })
      .state('mainstations.edit', {
        url: '/:mainstationId/edit',
        templateUrl: 'modules/mainstations/client/views/form-mainstation.client.view.html',
        controller: 'MainstationsController',
        controllerAs: 'vm',
        resolve: {
          mainstationResolve: getMainstation
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Edit Mainstation {{ mainstationResolve.name }}'
        }
      })
      .state('mainstations.view', {
        url: '/:mainstationId',
        templateUrl: 'modules/mainstations/client/views/view-mainstation.client.view.html',
        controller: 'MainstationsController',
        controllerAs: 'vm',
        resolve: {
          mainstationResolve: getMainstation
        },
        data: {
          pageTitle: 'Mainstation {{ mainstationResolve.name }}'
        }
      });
  }

  getMainstation.$inject = ['$stateParams', 'MainstationsService'];

  function getMainstation($stateParams, MainstationsService) {
    return MainstationsService.get({
      mainstationId: $stateParams.mainstationId
    }).$promise;
  }

  newMainstation.$inject = ['MainstationsService'];

  function newMainstation(MainstationsService) {
    return new MainstationsService();
  }
}());
