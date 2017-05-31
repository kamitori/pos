(function () {
  'use strict';

  angular
    .module('selectlists')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('selectlists', {
        abstract: true,
        url: '/selectlists',
        template: '<ui-view/>'
      })
      .state('selectlists.list', {
        url: '',
        templateUrl: 'modules/selectlists/client/views/list-selectlists.client.view.html',
        controller: 'SelectlistsListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Selectlists List'
        }
      })
      .state('selectlists.create', {
        url: '/create',
        templateUrl: 'modules/selectlists/client/views/form-selectlist.client.view.html',
        controller: 'SelectlistsController',
        controllerAs: 'vm',
        resolve: {
          selectlistResolve: newSelectlist
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Selectlists Create'
        }
      })
      .state('selectlists.edit', {
        url: '/:selectlistId/edit',
        templateUrl: 'modules/selectlists/client/views/form-selectlist.client.view.html',
        controller: 'SelectlistsController',
        controllerAs: 'vm',
        resolve: {
          selectlistResolve: getSelectlist
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Edit Selectlist {{ selectlistResolve.name }}'
        }
      })
      .state('selectlists.view', {
        url: '/:selectlistId',
        templateUrl: 'modules/selectlists/client/views/view-selectlist.client.view.html',
        controller: 'SelectlistsController',
        controllerAs: 'vm',
        resolve: {
          selectlistResolve: getSelectlist
        },
        data: {
          pageTitle: 'Selectlist {{ selectlistResolve.name }}'
        }
      });
  }

  getSelectlist.$inject = ['$stateParams', 'SelectlistsService'];

  function getSelectlist($stateParams, SelectlistsService) {
    return SelectlistsService.get({
      selectlistId: $stateParams.selectlistId
    }).$promise;
  }

  newSelectlist.$inject = ['SelectlistsService'];

  function newSelectlist(SelectlistsService) {
    return new SelectlistsService();
  }
}());
