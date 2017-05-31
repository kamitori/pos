// Tbworkinghours service used to communicate Tbworkinghours REST endpoints
(function () {
  'use strict';

  angular
    .module('tbworkinghours')
    .factory('TbworkinghoursService', TbworkinghoursService);

  TbworkinghoursService.$inject = ['$resource'];

  function TbworkinghoursService($resource) {
    return $resource('/api/tbworkinghours/:tbworkinghourId', {
      tbworkinghourId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
}());
