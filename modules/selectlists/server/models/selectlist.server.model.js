'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Selectlist Schema
 */
var SelectlistSchema = new Schema({
  name: {
    type: String,
    default: '',
    required: 'Please fill Selectlist name',
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

mongoose.model('Selectlist', SelectlistSchema);
