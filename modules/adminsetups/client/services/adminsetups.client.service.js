// Adminsetups service used to communicate Adminsetups REST endpoints
(function () {
  'use strict';

  angular
    .module('adminsetups')
    .factory('AdminsetupsService', AdminsetupsService);

  AdminsetupsService.$inject = ['$resource'];

  function AdminsetupsService($resource) {
    return $resource('api/adminsetups/:adminsetupId', {
      adminsetupId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
}());
