'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Salesreport Schema
 */
var SalesreportSchema = new Schema({
  name: {
    type: String,
    default: '',
  },
  created: {
    type: Date,
    default: Date.now
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  }
}, { collection: 'tb_new_salesorder' });

mongoose.model('Salesreport', SalesreportSchema);
