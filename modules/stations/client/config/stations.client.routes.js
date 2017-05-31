(function () {
  'use strict';

  angular
    .module('stations')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('stations', {
        abstract: true,
        url: '/stations',
        template: '<ui-view/>'
      })
      .state('stations.list', {
        url: '',
        templateUrl: 'modules/stations/client/views/list-stations.client.view.html',
        controller: 'StationsListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Stations List'
        }
      })
      .state('stations.create', {
        url: '/create',
        templateUrl: 'modules/stations/client/views/form-station.client.view.html',
        controller: 'StationsController',
        controllerAs: 'vm',
        resolve: {
          stationResolve: newStation
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Stations Create'
        }
      })
      .state('stations.edit', {
        url: '/:stationId/edit',
        templateUrl: 'modules/stations/client/views/form-station.client.view.html',
        controller: 'StationsController',
        controllerAs: 'vm',
        resolve: {
          stationResolve: getStation
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Edit Station {{ stationResolve.name }}'
        }
      })
      .state('stations.view', {
        url: '/:stationId',
        templateUrl: 'modules/stations/client/views/view-station.client.view.html',
        controller: 'StationsController',
        controllerAs: 'vm',
        resolve: {
          stationResolve: getStation
        },
        data: {
          pageTitle: 'Station {{ stationResolve.name }}'
        }
      });
  }

  getStation.$inject = ['$stateParams', 'StationsService'];

  function getStation($stateParams, StationsService) {
    return StationsService.get({
      stationId: $stateParams.stationId
    }).$promise;
  }

  newStation.$inject = ['StationsService'];

  function newStation(StationsService) {
    return new StationsService();
  }
}());
