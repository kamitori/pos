(function () {
  'use strict';

  angular
    .module('salesreports')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('salesreports', {
        abstract: true,
        url: '/salesreports',
        template: '<ui-view/>'
      })
      .state('salesreports.list', {
        url: '',
        templateUrl: 'modules/salesreports/client/views/list-salesreports.client.view.html',
        controller: 'SalesreportsListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Salesreports List'
        }
      })
      .state('salesreports.weekly', {
        url: '/weekly',
        templateUrl: 'modules/salesreports/client/views/list-weekly-salesreports.client.view.html',
        controller: 'SalesreportsListWeeklyController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Salesreports List'
        }
      })
      .state('salesreports.create', {
        url: '/create',
        templateUrl: 'modules/salesreports/client/views/form-salesreport.client.view.html',
        controller: 'SalesreportsController',
        controllerAs: 'vm',
        resolve: {
          salesreportResolve: newSalesreport
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Salesreports Create'
        }
      })
      .state('salesreports.edit', {
        url: '/:salesreportId/edit',
        templateUrl: 'modules/salesreports/client/views/form-salesreport.client.view.html',
        controller: 'SalesreportsController',
        controllerAs: 'vm',
        resolve: {
          salesreportResolve: getSalesreport
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Edit Salesreport {{ salesreportResolve.name }}'
        }
      })
      .state('salesreports.view', {
        url: '/:salesreportId',
        templateUrl: 'modules/salesreports/client/views/view-salesreport.client.view.html',
        controller: 'SalesreportsController',
        controllerAs: 'vm',
        resolve: {
          salesreportResolve: getSalesreport
        },
        data: {
          pageTitle: 'Salesreport {{ salesreportResolve.name }}'
        }
      });
  }

  getSalesreport.$inject = ['$stateParams', 'SalesreportsService'];

  function getSalesreport($stateParams, SalesreportsService) {
    return SalesreportsService.get({
      salesreportId: $stateParams.salesreportId
    }).$promise;
  }

  newSalesreport.$inject = ['SalesreportsService'];

  function newSalesreport(SalesreportsService) {
    return new SalesreportsService();
  }
}());
