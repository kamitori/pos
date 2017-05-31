'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Appointment Schema
 */
var AppointmentSchema = new Schema({
  created: {
    type: Date,
    default: Date.now
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  },
  staff: {
    type: Schema.Types.Mixed,
    default: ''
  },
  staffname: {
    type: String,
    default: ''
  },
  service: {
    type: Schema.Types.Mixed,
    default: ''
  },
  servicename: {
    type: String,
    default: ''
  },
  customer: {
    type: Schema.ObjectId,
    ref: 'Customer'
  },
  company: {
    type: Schema.ObjectId,
    ref: 'Company'
  },
  note: {
    type: String,
    default: '',
    trim: true
  },
  label: {
    type: String,
    default: 'No Label',
    trim: true
  },
  sprice: {
    type: Number
  },
  sduration: {
    type: Number
  },
  datetime: {
    type: Date,
    default: Date.now
  },
  time: {
    type: Schema.Types.Mixed,
    default: ''
  }
});

mongoose.model('Appointment', AppointmentSchema);
