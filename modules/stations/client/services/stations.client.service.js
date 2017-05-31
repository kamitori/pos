// Stations service used to communicate Stations REST endpoints
(function () {
  'use strict';

  angular
    .module('stations')
    .factory('StationsService', StationsService);

  StationsService.$inject = ['$resource'];

  function StationsService($resource) {
    return $resource('api/stations/:stationId', {
      stationId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
}());
