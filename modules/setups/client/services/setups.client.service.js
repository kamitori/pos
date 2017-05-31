// Setups service used to communicate Setups REST endpoints
(function () {
  'use strict';

  angular
    .module('setups')
    .factory('SetupsService', SetupsService);

  SetupsService.$inject = ['$resource'];

  function SetupsService($resource) {
    return $resource('/api/setups/:setupId', {
      setupId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
}());
