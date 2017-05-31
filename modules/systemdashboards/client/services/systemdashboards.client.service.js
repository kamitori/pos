// Systemdashboards service used to communicate Systemdashboards REST endpoints
(function () {
  'use strict';

  angular
    .module('systemdashboards')
    .factory('SystemdashboardsService', SystemdashboardsService);

  SystemdashboardsService.$inject = ['$resource'];

  function SystemdashboardsService($resource) {
    return $resource('api/systemdashboards/:systemdashboardId', {
      systemdashboardId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
}());
