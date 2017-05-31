'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Tbworkinghour Schema
 */
var TbworkinghourSchema = new Schema({
  name: {
    type: String,
    default: '',
    required: 'Please fill Tbworkinghour name',
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
}, { collection: 'tb_working_hour' });

mongoose.model('Tbworkinghour', TbworkinghourSchema);
