'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Mainstation Schema
 */
var MainstationSchema = new Schema({
  name: {
    type: String,
    default: '',
    required: 'Please fill Mainstation name',
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

mongoose.model('Mainstation', MainstationSchema);
