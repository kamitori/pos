'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Appintegration Schema
 */
var AppintegrationSchema = new Schema({
  name: {
    type: String,
    default: '',
    required: 'Please fill Appintegration name',
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

mongoose.model('Appintegration', AppintegrationSchema);
