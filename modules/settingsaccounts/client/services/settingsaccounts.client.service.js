// Settingsaccounts service used to communicate Settingsaccounts REST endpoints
(function () {
  'use strict';

  angular
    .module('settingsaccounts')
    .factory('SettingsaccountsService', SettingsaccountsService);

  SettingsaccountsService.$inject = ['$resource'];

  function SettingsaccountsService($resource) {
    return $resource('/api/settingsaccounts/:settingsaccountId', {
      settingsaccountId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
}());
