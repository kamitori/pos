(function () {
  'use strict';

  angular
    .module('settingsaccounts')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('settingsaccounts', {
        abstract: true,
        url: '/accounts',
        template: '<ui-view/>'
      })
      .state('settingsaccounts.list', {
        url: '',
        templateUrl: 'modules/settingsaccounts/client/views/list-settingsaccounts.client.view.html',
        controller: 'SettingsaccountsListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Settingsaccounts List'
        }
      })
      .state('settingsaccounts.export', {
        url: '/export',
        templateUrl: 'modules/settingsaccounts/client/views/export-settingsaccounts.client.view.html',
        controller: 'SettingsaccountsListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Export List'
        }
      })
      .state('settingsaccounts.create', {
        url: '/create',
        templateUrl: 'modules/settingsaccounts/client/views/form-settingsaccount.client.view.html',
        controller: 'SettingsaccountsController',
        controllerAs: 'vm',
        resolve: {
          settingsaccountResolve: newSettingsaccount
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Settingsaccounts Create'
        }
      })
      .state('settingsaccounts.edit', {
        url: '/:settingsaccountId/edit',
        templateUrl: 'modules/settingsaccounts/client/views/form-settingsaccount.client.view.html',
        controller: 'SettingsaccountsController',
        controllerAs: 'vm',
        resolve: {
          settingsaccountResolve: getSettingsaccount
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Edit Settingsaccount {{ settingsaccountResolve.name }}'
        }
      })
      .state('settingsaccounts.view', {
        url: '/:settingsaccountId',
        templateUrl: 'modules/settingsaccounts/client/views/view-settingsaccount.client.view.html',
        controller: 'SettingsaccountsController',
        controllerAs: 'vm',
        resolve: {
          settingsaccountResolve: getSettingsaccount
        },
        data: {
          pageTitle: 'Settingsaccount {{ settingsaccountResolve.name }}'
        }
      });
  }

  getSettingsaccount.$inject = ['$stateParams', 'SettingsaccountsService'];

  function getSettingsaccount($stateParams, SettingsaccountsService) {
    return SettingsaccountsService.get({
      settingsaccountId: $stateParams.settingsaccountId
    }).$promise;
  }

  newSettingsaccount.$inject = ['SettingsaccountsService'];

  function newSettingsaccount(SettingsaccountsService) {
    return new SettingsaccountsService();
  }
}());
