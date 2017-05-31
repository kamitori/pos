'use strict';

/**
 * Module dependencies
 */
var appointmentsPolicy = require('../policies/appointments.server.policy'),
  appointments = require('../controllers/appointments.server.controller');

module.exports = function(app) {
  // Appointments Routes
  app.route('/api/appointments').all(appointmentsPolicy.isAllowed)
    .get(appointments.list)
    .post(appointments.create);

  app.route('/api/appointments/getAppointmentByCustomer/:customerIdAppointment').all(appointmentsPolicy.isAllowed)
    .get(appointments.getAppointmentByCustomer)
    .post(appointments.deleteAppointmentFromCustomer)
    .put(appointments.updateAppointmentFromCustomer);

  app.route('/api/appointments/:appointmentId').all(appointmentsPolicy.isAllowed)
    .get(appointments.read)
    .put(appointments.update)
    .delete(appointments.delete);

  // Finish by binding the Appointment middleware
  app.param('customerIdAppointment', appointments.AppointmentByCustomer);
  app.param('appointmentId', appointments.appointmentByID);
};
