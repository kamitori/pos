// Appintegrations service used to communicate Appintegrations REST endpoints
(function () {
  'use strict';

  angular
    .module('appintegrations')
    .factory('AppintegrationsService', AppintegrationsService);

  AppintegrationsService.$inject = ['$resource'];

  function AppintegrationsService($resource) {
    return $resource('api/appintegrations/:appintegrationId', {
      appintegrationId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
}());
