'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;
var crypto = require('crypto');

/**
 * Staff Schema
 */
var StaffSchema = new Schema({
  full_name: {
    type: String,
    default: '',
    required: 'Please fill Staff name',
    trim: true
  },
  staffid: {
    type: String,
    default: ''
  },
  deleted: {
    type: Boolean,
    default: false
  },
  password: {
    type: String,
    default: ''
  },
  change_pass_first_login: {
    type: Number,
    default: 0
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
  workinghours: {
    type: Schema.Types.Mixed,
    default: ''
  },
  appointment_calendar: {
    type: Number,
    default: 0
  },
  server_customers: {
    type: Object,
    default: {}
  },
  services: {
    type: Schema.Types.Mixed,
    default: {}
  },
  time_break: {
    type: Schema.Types.Mixed,
    default: {}
  },
  time_off: {
    type: Schema.Types.Mixed,
    default: {}
  },
  is_employee: {
    type: Number,
    default: 0
  },
  google_syn: {
    type: String,
    default: 'N/A'
  },
  outlook_sync: {
    type: String,
    default: 'N/A'
  },
  office_365_syn: {
    type: String,
    default: 'N/A'
  },
  calendar_url: {
    type: String,
    default: 'N/A'
  },
  staff_booking_page: {
    type: String,
    default: 'N/A'
  },
  experience: {
    type: String,
    default: 'N/A'
  },
  created: {
    type: Date,
    default: Date.now
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  }
}, { collection: 'tb_contact' });

StaffSchema.pre('save', function (next) {
  this.password = this.hashPassword(this.password);
  next();
});

StaffSchema.methods.hashPassword = function (password) {
  var step1 = crypto.createHash('md5').update(password).digest("hex");
  return crypto.createHash('md5').update(step1+this._id).digest("hex");  
};

mongoose.model('Staff', StaffSchema);
