(function () {
  'use strict';

  var staffapp = angular
    .module('staffs')
    .config(routeConfig);
  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('staffs', {
        url: '/staffs',
        templateUrl: 'modules/staffs/client/views/list-staffs.client.view.html',
        controller: 'StaffsListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Staffs List'
        }
      })
      .state('staffs.list', {
        url: '',
        templateUrl: 'modules/staffs/client/views/list-staffs.client.view.html',
        controller: 'StaffsListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Staffs List'
        }
      })
      .state('staffs.create', {
        url: '/create',
        templateUrl: 'modules/staffs/client/views/form-staff.client.view.html',
        controller: 'StaffsController',
        controllerAs: 'vm',
        resolve: {
          staffResolve: newStaff
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Staffs Create'
        }
      })
      .state('staffs.edit', {
        url: '/:staffId/edit',
        templateUrl: 'modules/staffs/client/views/form-staff.client.view.html',
        controller: 'StaffsEditController',
        controllerAs: 'vm',
        resolve: {
          staffResolve: getStaff
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Edit Staff {{ staffResolve.name }}'
        }
      })
      .state('staffs.edit.details', {
        url: '/:staffId/edit/details',
        templateUrl: 'modules/staffs/client/views/form-staff.client.view.html',
        controller: 'StaffsEditController',
        controllerAs: 'vm',
        resolve: {
          staffResolve: getStaff
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Edit Staff {{ staffResolve.name }}'
        }
      })
      .state('staffs.edit.service', {
        url: '/:staffId/edit/service',
        templateUrl: 'modules/staffs/client/views/form-staff.client.view.html',
        controller: 'StaffsEditController',
        controllerAs: 'vm',
        resolve: {
          staffResolve: getStaff
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Edit Staff {{ staffResolve.name }}'
        }
      })
      .state('staffs.edit.workinghours', {
        url: '/:staffId/edit/workinghours',
        templateUrl: 'modules/staffs/client/views/form-staff.client.view.html',
        controller: 'StaffsEditController',
        controllerAs: 'vm',
        resolve: {
          staffResolve: getStaff
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Edit Staff {{ staffResolve.name }}'
        }
      })
      .state('staffs.edit.breaks', {
        url: '/:staffId/edit/breaks',
        templateUrl: 'modules/staffs/client/views/form-staff.client.view.html',
        controller: 'StaffsEditController',
        controllerAs: 'vm',
        resolve: {
          staffResolve: getStaff
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Edit Staff {{ staffResolve.name }}'
        }
      })
      .state('staffs.edit.timeoff', {
        url: '/:staffId/edit/timeoff',
        templateUrl: 'modules/staffs/client/views/form-staff.client.view.html',
        controller: 'StaffsEditController',
        controllerAs: 'vm',
        resolve: {
          staffResolve: getStaff
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Edit Staff {{ staffResolve.name }}'
        }
      })
      .state('staffs.view', {
        url: '/:staffId',
        templateUrl: 'modules/staffs/client/views/view-staff.client.view.html',
        controller: 'StaffsController',
        controllerAs: 'vm',
        resolve: {
          staffResolve: getStaff
        },
        data: {
          pageTitle: 'Staff {{ staffResolve.name }}'
        }
      });
  }

  getStaff.$inject = ['$stateParams', 'StaffsService'];

  function getStaff($stateParams, StaffsService) {
    return StaffsService.get({
      staffId: $stateParams.staffId
    }).$promise;
  }

  newStaff.$inject = ['StaffsService'];

  function newStaff(StaffsService) {
    return new StaffsService();
  }
}());
