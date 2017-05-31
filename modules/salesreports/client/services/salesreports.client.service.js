// Salesreports service used to communicate Salesreports REST endpoints
(function () {
  'use strict';

  angular
    .module('salesreports')
    .factory('SalesreportsService', SalesreportsService);

  SalesreportsService.$inject = ['$resource'];

  function SalesreportsService($resource) {
    return $resource('api/salesreports/:salesreportId', {
      salesreportId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
}());
