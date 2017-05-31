// Appointments service used to communicate Appointments REST endpoints
(function () {
  'use strict';

  angular
    .module('appointments')
    .factory('AppointmentsByCustomerService', AppointmentsByCustomerService)
    .factory('AppointmentsService', AppointmentsService);

  AppointmentsService.$inject = ['$resource'];

  function AppointmentsService($resource) {
    return $resource('api/appointments/:appointmentId', {
      appointmentId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }

  AppointmentsByCustomerService.$inject = ['$resource'];

  function AppointmentsByCustomerService($resource) {
    var service;
    service = {
      getAppointmentByCustomer: getAppointmentByCustomer
    };
    function getAppointmentByCustomer() {
      return $resource('/api/appointments/getAppointmentByCustomer/:customerIdAppointment',{},
      {
        getAppointment: { method: 'GET', params: { customerIdAppointment:'@customer' }, isArray: true },
        removeAppointment: { method: 'POST', params: { customerIdAppointment:'@customer' } },
        update: { method: 'PUT', params: { customerIdAppointment:'@customer' } }
      });
    }
    return service;
  }
}());
