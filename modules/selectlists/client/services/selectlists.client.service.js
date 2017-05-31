// Selectlists service used to communicate Selectlists REST endpoints
(function () {
  'use strict';

  angular
    .module('selectlists')
    .factory('SelectlistsService', SelectlistsService);

  SelectlistsService.$inject = ['$resource'];

  function SelectlistsService($resource) {
    return $resource('/api/selectlists/:selectlistId', {
      selectlistId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
}());
