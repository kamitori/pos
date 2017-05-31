// Calendars service used to communicate Calendars REST endpoints
(function () {
  'use strict';

  angular
    .module('calendars')
    .factory('CalendarsService', CalendarsService);

  CalendarsService.$inject = ['$resource'];

  function CalendarsService($resource) {
    return $resource('/api/calendars/:calendarId', {
      calendarId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }


  angular
    .module('customers')
    .factory('CustomersService', CustomersService);

  CustomersService.$inject = ['$resource'];

  function CustomersService($resource) {
    return $resource('/api/customers/:customerId', {
      customerId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
}());
