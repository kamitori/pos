'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Adminsystem Schema
 */
var AdminsystemSchema = new Schema({
  name: {
    type: String,
    default: '',
    required: 'Please fill Adminsystem name',
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

mongoose.model('Adminsystem', AdminsystemSchema);
