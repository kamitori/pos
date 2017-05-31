(function () {
  'use strict';

  angular
    .module('timeoffs')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('timeoffs', {
        abstract: true,
        url: '/timeoffs',
        template: '<ui-view/>'
      })
      .state('timeoffs.list', {
        url: '',
        templateUrl: 'modules/timeoffs/client/views/list-timeoffs.client.view.html',
        controller: 'TimeoffsListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Timeoffs List'
        }
      })
      .state('timeoffs.create', {
        url: '/create',
        templateUrl: 'modules/timeoffs/client/views/form-timeoff.client.view.html',
        controller: 'TimeoffsController',
        controllerAs: 'vm',
        resolve: {
          timeoffResolve: newTimeoff
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Timeoffs Create'
        }
      })
      .state('timeoffs.edit', {
        url: '/:timeoffId/edit',
        templateUrl: 'modules/timeoffs/client/views/form-timeoff.client.view.html',
        controller: 'TimeoffsController',
        controllerAs: 'vm',
        resolve: {
          timeoffResolve: getTimeoff
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Edit Timeoff {{ timeoffResolve.name }}'
        }
      })
      .state('timeoffs.view', {
        url: '/:timeoffId',
        templateUrl: 'modules/timeoffs/client/views/view-timeoff.client.view.html',
        controller: 'TimeoffsController',
        controllerAs: 'vm',
        resolve: {
          timeoffResolve: getTimeoff
        },
        data: {
          pageTitle: 'Timeoff {{ timeoffResolve.name }}'
        }
      });
  }

  getTimeoff.$inject = ['$stateParams', 'TimeoffsService'];

  function getTimeoff($stateParams, TimeoffsService) {
    return TimeoffsService.get({
      timeoffId: $stateParams.timeoffId
    }).$promise;
  }

  newTimeoff.$inject = ['TimeoffsService'];

  function newTimeoff(TimeoffsService) {
    return new TimeoffsService();
  }
}());
