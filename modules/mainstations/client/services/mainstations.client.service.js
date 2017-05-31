// Mainstations service used to communicate Mainstations REST endpoints
(function () {
  'use strict';

  angular
    .module('mainstations')
    .factory('MainstationsService', MainstationsService);

  MainstationsService.$inject = ['$resource'];

  function MainstationsService($resource) {
    return $resource('api/mainstations/:mainstationId', {
      mainstationId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
}());
