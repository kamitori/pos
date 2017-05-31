'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Adminservice Schema
 */
var AdminserviceSchema = new Schema({
  name: {
    type: String,
    default: '',
    required: 'Please fill Adminservice name',
    trim: true
  },
  stype: {
    type: String,
    default: 'black',
    trim: true
  },
  sprice: {
    type: Number,
    default: 0,
    trim: true
  },
  description: {
    type: String,
    default: '',
    trim: true
  },
  sduration: {
    type: Number,
    default: '45',
    trim: true
  },
  extratime: {
    type: Number,
    default: '15',
    trim: true
  },
  alias: {
    type: String,
    default: '',
    trim: true
  },
  imgthumb: {
    type: String,
    default: '',
    trim: true
  },
  cate_type: {
    type: String,
    default: 'dish_washer',
    trim: true
  },
  created: {
    type: Date,
    default: Date.now
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  },
  company: {
    type: Schema.ObjectId,
    ref: 'Company'
  },
  staffs: {
    type: Schema.Types.Mixed,
    default: ''
  }
});

mongoose.model('Adminservice', AdminserviceSchema);
