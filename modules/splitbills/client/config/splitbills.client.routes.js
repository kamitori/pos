(function () {
  'use strict';

  angular
    .module('splitbills')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('splitbills', {
        abstract: true,
        url: '/splitbills',
        template: '<ui-view/>'
      })
      .state('splitbills.list', {
        url: '',
        templateUrl: '/modules/splitbills/client/views/index-splitbills.client.view.html',
        controller: 'SplitbillsListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Splitbills Index'
        },
      })
      .state('splitbills.split', {
        url: '/split',
        templateUrl: '/modules/splitbills/client/views/splitted-splitbills.client.view.html',
        controller: 'SplitbillsListController',
        controllerAs: 'vm',
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Bill splitted'
        }
      })
      .state('splitbills.create', {
        url: '/create',
        templateUrl: '/modules/splitbills/client/views/form-splitbill.client.view.html',
        controller: 'SplitbillsController',
        controllerAs: 'vm',
        resolve: {
          splitbillResolve: newSplitbill
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Splitbills Create'
        }
      })
      .state('splitbills.edit', {
        url: '/:splitbillId/edit',
        templateUrl: '/modules/splitbills/client/views/form-splitbill.client.view.html',
        controller: 'SplitbillsController',
        controllerAs: 'vm',
        resolve: {
          splitbillResolve: getSplitbill
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Edit Splitbill {{ splitbillResolve.name }}'
        }
      })
      .state('splitbills.view', {
        url: '/:splitbillId',
        templateUrl: '/modules/splitbills/client/views/view-splitbill.client.view.html',
        controller: 'SplitbillsController',
        controllerAs: 'vm',
        resolve: {
          splitbillResolve: getSplitbill
        },
        data: {
          pageTitle: 'Splitbill {{ splitbillResolve.name }}'
        }
      });
  }

  getSplitData.$inject = ['$stateParams', 'SplitbillsService'];

  function getSplitData($stateParams, SplitbillsService) {
    return new SplitbillsService();
  }

  getSplitbill.$inject = ['$stateParams', 'SplitbillsService'];

  function getSplitbill($stateParams, SplitbillsService) {
    return SplitbillsService.get({
      splitbillId: $stateParams.splitbillId
    }).$promise;
  }

  newSplitbill.$inject = ['SplitbillsService'];

  function newSplitbill(SplitbillsService) {
    return new SplitbillsService();
  }
}());
