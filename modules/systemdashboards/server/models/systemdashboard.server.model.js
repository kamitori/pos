'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Systemdashboard Schema
 */
var SystemdashboardSchema = new Schema({
  name: {
    type: String,
    default: '',
    required: 'Please fill Systemdashboard name',
    trim: true
  },
  created: {
    type: Date,
    default: Date.now
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  }
});

mongoose.model('Systemdashboard', SystemdashboardSchema);
