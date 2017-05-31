'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Appointment = mongoose.model('Appointment'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a Appointment
 */
exports.create = function(req, res) {
  var appointment = new Appointment(req.body);
  appointment.user = req.user;

  appointment.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(appointment);
    }
  });
};

/**
 * Show the current Appointment
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var appointment = req.appointment ? req.appointment.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  appointment.isCurrentUserOwner = req.user && appointment.user && appointment.user._id.toString() === req.user._id.toString();

  res.jsonp(appointment);
};

/**
 * Update a Appointment
 */
exports.update = function(req, res) {
  var appointment = req.appointment;

  appointment = _.extend(appointment, req.body);

  appointment.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(appointment);
    }
  });
};

/**
 * Delete an Appointment
 */
exports.delete = function(req, res) {
  var appointment = req.appointment;

  appointment.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(appointment);
    }
  });
};

/**
 * List of Appointments
 */
exports.list = function(req, res) {
  Appointment.find().sort('-created').populate('user', 'displayName').exec(function(err, appointments) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(appointments);
    }
  });
};

/**
 * Appointment middleware
 */
exports.appointmentByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Appointment is invalid'
    });
  }

  Appointment.findById(id).populate('user', 'displayName').exec(function (err, appointment) {
    if (err) {
      return next(err);
    } else if (!appointment) {
      return res.status(404).send({
        message: 'No Appointment with that identifier has been found'
      });
    }
    req.appointment = appointment;
    next();
  });
};

exports.AppointmentByCustomer = function(req, res, next, customerIdAppointment) {
  if(customerIdAppointment === undefined){
    next();
  }else{
    if (!mongoose.Types.ObjectId.isValid(customerIdAppointment)) {
      return res.status(405).send({
        message: 'Customer is invalid'
      });
    }
    Appointment.find({'customer': new mongoose.Types.ObjectId(customerIdAppointment) }).exec(function (err, appointments, Services) {
      if (err) {
        return next(err);
      } else if (!appointments) {
        return res.status(404).send({
          message: 'No Appointment with that identifier has been found'
        });
      }

      req.appointments = appointments;
      
      if(req.body._id){
        var id = req.body._id;
        if (!mongoose.Types.ObjectId.isValid(id)) {
          return res.status(405).send({
            message: 'Appointment is invalid'
          });
        }
        Appointment.findById(id).populate('user', 'displayName').exec(function (err, appointment, Services) {
          if (err) {
            return next(err);
          } else if (!appointment) {
            return res.status(404).send({
              message: 'No Appointment with that identifier has been found'
            });
          }
          req.appointment = appointment;
          next();
        });
      }else{
        next();
      }
    });
  }
}
exports.getAppointmentByCustomer = function(req, res) {
  // convert mongoose document to JSON
  res.jsonp(req.appointments);
}
exports.deleteAppointmentFromCustomer = function(req, res) {
  var appointment = req.appointment;
  appointment.remove(function(err) {
    if (err) {
      return res.status(405).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(appointment);
    }
  });
}
exports.updateAppointmentFromCustomer = function(req, res) {
  var appointment = req.appointment;
  appointment = _.extend(appointment, req.body);
  appointment.markModified('appointment');
  appointment.save(function(err) {
    if (err) {
      return res.status(405).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(appointment);
    }
  });
}

