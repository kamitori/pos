'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Restaurant Schema
 */
var RestaurantSchema = new Schema({
  name: {
    type: String,
    default: '',
    required: 'Please fill Restaurant name',
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
}, { collection: 'tb_company' });

mongoose.model('Restaurant', RestaurantSchema);
