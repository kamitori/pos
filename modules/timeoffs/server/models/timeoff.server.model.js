'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Timeoff Schema
 */
var TimeoffSchema = new Schema({
  name: {
    type: String,
    default: '',
    required: 'Please fill Timeoff name',
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

mongoose.model('Timeoff', TimeoffSchema);
