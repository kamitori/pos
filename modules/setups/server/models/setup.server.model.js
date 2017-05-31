'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Setup Schema
 */
var SetupSchema = new Schema({
  name: {
    type: String,
    default: ''
  },
  alias: {
    type: String,
    default: ''
  },
  is_send_email: {
    type: Number,
    default: 0
  },
  deleted: {
    type: Number,
    default: 0
  },
  description: {
    type: String,
    default: ''
  },
  module_name: {
    type: String,
    default: ''
  },
  smtp_address: {
    type: String,
    default: ''
  },
  smtp_port: {
    type: String,
    default: ''
  },
  smtp_username: {
    type: String,
    default: ''
  },
  type : {
    type: String,
    default: ''
  },
  stmp_password : {
    type: String,
    default: ''
  },
  email_signature: {
    type: String,
    default: ''
  },
  push_notification: {
    type: Number,
    default: 0
  },
  send_thank_you_email: {
    type: Number,
    default: 0
  },
  push_notification_reservation: {
    type: Number,
    default: 0
  },
  created: {
    type: Date,
    default: Date.now
  }, 
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  }
}, { collection: 'tb_stuffs' });

mongoose.model('Setup', SetupSchema);
