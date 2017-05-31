'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Product Schema
 */
var ProductSchema = new Schema({
  name: {
    type: String,
    default: '',
    required: 'Please fill Product name',
    trim: true
  },
  description: {
    type: String,
    default: ''
  },
  product_desciption: {
    type: String,
    default: ''
  },
  quantity: {
    type: Number,
    default: 0
  },
  image: {
    type: String,
    default: ''
  },
  category: {
    type: String,
    default: ''
  },
  use_group_order: {
    type: Number,
    default: ''
  },
  combo_sales: {
    type: Number,
    default: ''
  },
  product_base: {
    type: String,
    default: ''
  },
  pricebreaks: {
    type: Schema.Types.Mixed
  },
  op_description: {
    type: Schema.Types.Mixed
  },
  options: {
    type: Schema.Types.Mixed
  },
  products_upload: {
    type: Schema.Types.Mixed
  },
  created: {
    type: Date,
    default: Date.now
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  }
}, { collection: 'tb_product' });

mongoose.model('Product', ProductSchema);
