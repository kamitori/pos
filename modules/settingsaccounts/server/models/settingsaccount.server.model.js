'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Settingsaccount Schema
 */
var SettingsaccountSchema = new Schema({
  full_name: {
    type: String,
    default: '',
    required: 'Please fill Staff name',
    trim: true
  },
  no: {
    type: String,
    default: 'N/A'
  },
  deleted: {
    type: Boolean,
    default: false
  },
  our_rep: {
    type: String,
    default: 'N/A'
  },
  photo: {
    type: String,
    default: '/themes/admin/images/user-avatar.png'
  },
  email: {
    type: String,
    default: '',
    required: 'Please fill Staff email',
  },
  emailccto: {
    type: String,
    default: 'N/A'
  },
  mobile: {
    type: String,
    default: 'N/A'
  },
  address: {
    type: String,
    default: 'N/A'
  },  
  staff_booking_page: {
    type: String,
    default: 'N/A'
  },
  week_start_day: {
    type: String,
    default: 'monday'
  },
  calendar_start_hour: {
    type: String,
    default: '8:00 am'
  },
  calendar_end_hour: {
    type: String,
    default: '5:00 pm'
  },
  preferred_language: {
    type: String,
    default: 'english'
  },
  created: {
    type: Date,
    default: Date.now
  },
  our_rep_id: {
    type: Schema.ObjectId
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  }
}, { collection: 'tb_contact' });

mongoose.model('Settingsaccount', SettingsaccountSchema);
