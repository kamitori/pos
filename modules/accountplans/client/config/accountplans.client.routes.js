(function () {
  'use strict';

  angular
    .module('accountplans')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('accountplans', {
        abstract: true,
        url: '/accountplans',
        template: '<ui-view/>'
      })
      .state('accountplans.index', {
        url: '/index',
        templateUrl: '/modules/accountplans/client/views/index-accountplan.client.view.html',
        controller: 'AccountplansListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Accountplans Index'
        }
      })
      .state('accountplans.list', {
        url: '',
        templateUrl: '/modules/accountplans/client/views/list-accountplans.client.view.html',
        controller: 'AccountplansListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Accountplans List'
        }
      })
      .state('accountplans.create', {
        url: '/create',
        templateUrl: '/modules/accountplans/client/views/form-accountplan.client.view.html',
        controller: 'AccountplansController',
        controllerAs: 'vm',
        resolve: {
          accountplanResolve: newAccountplan
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Accountplans Create'
        }
      })
      .state('accountplans.edit', {
        url: '/:accountplanId/edit',
        templateUrl: '/modules/accountplans/client/views/form-accountplan.client.view.html',
        controller: 'AccountplansController',
        controllerAs: 'vm',
        resolve: {
          accountplanResolve: getAccountplan
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Edit Accountplan {{ accountplanResolve.name }}'
        }
      })
      .state('accountplans.view', {
        url: '/:accountplanId',
        templateUrl: '/modules/accountplans/client/views/view-accountplan.client.view.html',
        controller: 'AccountplansController',
        controllerAs: 'vm',
        resolve: {
          accountplanResolve: getAccountplan
        },
        data: {
          pageTitle: 'Accountplan {{ accountplanResolve.name }}'
        }
      });
  }

  getAccountplan.$inject = ['$stateParams', 'AccountplansService'];

  function getAccountplan($stateParams, AccountplansService) {
    return AccountplansService.get({
      accountplanId: $stateParams.accountplanId
    }).$promise;
  }

  newAccountplan.$inject = ['AccountplansService'];

  function newAccountplan(AccountplansService) {
    return new AccountplansService();
  }
}());
