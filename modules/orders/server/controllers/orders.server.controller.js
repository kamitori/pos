'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Order = mongoose.model('Order'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a Order
 */
exports.create = function(req, res) {
  var order_default = {
    deleted: false,
    delivery_method: '',
    invoice_address: [
      {
        deleted: false,
        shipping_address_1: '',
        shipping_address_2: '',
        shipping_address_3: '',
        shipping_town_city: '',
        shipping_zip_postcode: '',
        shipping_province_state_id: '',
        shipping_province_state: null,
        shipping_country: 'Canada',
        shipping_country_id: 'CA'
      }
    ],
    shipping_address: [
      {
        deleted: false,
        shipping_address_1: '',
        shipping_address_2: '',
        shipping_address_3: '',
        shipping_town_city: '',
        shipping_zip_postcode: '',
        shipping_province_state_id: '',
        shipping_province_state: null,
        shipping_country: 'Canada',
        shipping_country_id: 'CA'
      }
    ],
    cash_tend: 0,
    paid_by: '',
    pos_delay: '',
    time_delivery: new Date(),
    datetime_pickup: new Date(),
    order_type: 0,
    had_paid: 0,
    total_items: 0,
    had_paid_amount: 0,
    pay_account_order: [],
    status: 'In production',
    status_id: 'In production',
    asset_status: 'In production',
    salesorder_date: new Date(),
    payment_due_date: new Date(),
    payment_terms: 0,
    sales_order_type: '',
    job_id: '',
    job_name: '',
    job_number: '',
    quotation_id: '',
    quotation_name: '',
    quotation_number: '',
    customer_po_no: '',
    shipper: '',
    shipper_account: '',
    shipper_id: '',
    other_comment: '',
    completed: 0,
    voucher: '',
    taxper: 5,
    tax: 'AB',
    sum_amount: 0,
    sum_sub_total: 0,
    sum_tax: 0,
    refund: 0,
    name: '',
    heading: 'Create from POS',
    create_from: 'Create from POS',
  };
  order_default = _.extend(order_default, req.body);
  var order = new Order(order_default);
  order.user = req.user;

  order.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(order);
    }
  });
};

/**
 * Show the current Order
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var order = req.order ? req.order.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  order.isCurrentUserOwner = req.user && order.user && order.user._id.toString() === req.user._id.toString();

  res.jsonp(order);
};

/**
 * Update a Order
 */
exports.update = function(req, res) {
  var order = req.order;

  order = _.extend(order, req.body);

  order.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(order);
    }
  });
};

/**
 * Delete an Order
 */
exports.delete = function(req, res) {
  var order = req.order;

  order.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(order);
    }
  });
};

/**
 * List of Orders
 */
exports.list = function(req, res) {
  Order.find().sort('-created').populate('user', 'displayName').exec(function(err, orders) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(orders);
    }
  });
};

/**
 * Order middleware
 */
exports.orderByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Order is invalid'
    });
  }

  Order.findById(id).populate('user', 'displayName').exec(function (err, order) {
    if (err) {
      return next(err);
    } else if (!order) {
      return res.status(404).send({
        message: 'No Order with that identifier has been found'
      });
    }
    req.order = order;
    next();
  });
};
