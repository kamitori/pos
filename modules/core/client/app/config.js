(function (window) {
  'use strict';

  var applicationModuleName = 'mean';
  var service = {
    applicationEnvironment: window.env,
    applicationModuleName: applicationModuleName,
    applicationModuleVendorDependencies: ['ngResource', 'ngAnimate', 'ngMessages', 'ui.router', 'ui.bootstrap', 'ngFileUpload', 'ui-notification', 'ui.toggle', 'angularModalService', 'ui.calendar', '720kb.datepicker', 'ui.grid', 'ui.grid.selection', 'ui.grid.exporter', 'ui.grid.pagination', 'angularjs-dropdown-multiselect', 'LocalStorageModule', 'color.picker', 'angular-md5'],
    registerModule: registerModule
  };

  window.ApplicationConfiguration = service;

  // Add a new vertical module
  function registerModule(moduleName, dependencies) {
    // Create angular module
    angular.module(moduleName, dependencies || []);

    // Add the module to the AngularJS configuration file
    angular.module(applicationModuleName).requires.push(moduleName);
  }

  // Angular-ui-notification configuration
  angular.module('ui-notification').config(function(NotificationProvider) {
    NotificationProvider.setOptions({
      delay: 2000,
      startTop: 20,
      startRight: 10,
      verticalSpacing: 20,
      horizontalSpacing: 20,
      positionX: 'right',
      positionY: 'bottom'
    });
  });
}(window));
