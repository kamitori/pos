'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Accountplan Schema
 */
var AccountplanSchema = new Schema({
  name: {
    type: String,
    default: '',
    required: 'Please fill Accountplan name',
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

mongoose.model('Accountplan', AccountplanSchema);
