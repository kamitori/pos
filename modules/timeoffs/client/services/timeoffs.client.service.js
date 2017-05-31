// Timeoffs service used to communicate Timeoffs REST endpoints
(function () {
  'use strict';

  angular
    .module('timeoffs')
    .factory('TimeoffsService', TimeoffsService);

  TimeoffsService.$inject = ['$resource'];

  function TimeoffsService($resource) {
    return $resource('api/timeoffs/:timeoffId', {
      timeoffId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
}());
