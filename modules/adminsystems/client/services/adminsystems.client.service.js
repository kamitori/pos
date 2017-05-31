// Adminsystems service used to communicate Adminsystems REST endpoints
(function () {
  'use strict';

  angular
    .module('adminsystems')
    .factory('AdminsystemsService', AdminsystemsService);

  AdminsystemsService.$inject = ['$resource'];

  function AdminsystemsService($resource) {
    return $resource('api/adminsystems/:adminsystemId', {
      adminsystemId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
}());
