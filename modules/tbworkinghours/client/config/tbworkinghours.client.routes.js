(function () {
  'use strict';

  angular
    .module('tbworkinghours')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('tbworkinghours', {
        abstract: true,
        url: '/tbworkinghours',
        template: '<ui-view/>'
      })
      .state('tbworkinghours.list', {
        url: '',
        templateUrl: 'modules/tbworkinghours/client/views/list-tbworkinghours.client.view.html',
        controller: 'TbworkinghoursListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Tbworkinghours List'
        }
      })
      .state('tbworkinghours.create', {
        url: '/create',
        templateUrl: 'modules/tbworkinghours/client/views/form-tbworkinghour.client.view.html',
        controller: 'TbworkinghoursController',
        controllerAs: 'vm',
        resolve: {
          tbworkinghourResolve: newTbworkinghour
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Tbworkinghours Create'
        }
      })
      .state('tbworkinghours.edit', {
        url: '/:tbworkinghourId/edit',
        templateUrl: 'modules/tbworkinghours/client/views/form-tbworkinghour.client.view.html',
        controller: 'TbworkinghoursController',
        controllerAs: 'vm',
        resolve: {
          tbworkinghourResolve: getTbworkinghour
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Edit Tbworkinghour {{ tbworkinghourResolve.name }}'
        }
      })
      .state('tbworkinghours.view', {
        url: '/:tbworkinghourId',
        templateUrl: 'modules/tbworkinghours/client/views/view-tbworkinghour.client.view.html',
        controller: 'TbworkinghoursController',
        controllerAs: 'vm',
        resolve: {
          tbworkinghourResolve: getTbworkinghour
        },
        data: {
          pageTitle: 'Tbworkinghour {{ tbworkinghourResolve.name }}'
        }
      });
  }

  getTbworkinghour.$inject = ['$stateParams', 'TbworkinghoursService'];

  function getTbworkinghour($stateParams, TbworkinghoursService) {
    return TbworkinghoursService.get({
      tbworkinghourId: $stateParams.tbworkinghourId
    }).$promise;
  }

  newTbworkinghour.$inject = ['TbworkinghoursService'];

  function newTbworkinghour(TbworkinghoursService) {
    return new TbworkinghoursService();
  }
}());
