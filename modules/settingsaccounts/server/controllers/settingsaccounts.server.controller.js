'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Settingsaccount = mongoose.model('Settingsaccount'),
  Staff = mongoose.model('Staff'),
  Services = mongoose.model('Adminservice'),
  Customers = mongoose.model('Customer'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');
exports.listcustomers = function(req, res) {
  var data = [
    {
      'start_time': 'N/A',
      'end_time': 'N/A',
      'service_name': 'N/A',
      'customer_name': 'N/A',
      'customer_phone': 'N/A',
      'status': 'confirmed'
    },
    {
      'start_time': 'N/A',
      'end_time': 'N/A',
      'service_name': 'N/A',
      'customer_name': 'N/A',
      'customer_phone': 'N/A',
      'status': 'confirmed'
    },
    {
      'start_time': 'N/A',
      'end_time': 'N/A',
      'service_name': 'N/A',
      'customer_name': 'N/A',
      'customer_phone': 'N/A',
      'status': 'confirmed'
    },
    {
      'start_time': 'N/A',
      'end_time': 'N/A',
      'service_name': 'N/A',
      'customer_name': 'N/A',
      'customer_phone': 'N/A',
      'status': 'confirmed'
    },
    {
      'start_time': 'N/A',
      'end_time': 'N/A',
      'service_name': 'N/A',
      'customer_name': 'N/A',
      'customer_phone': 'N/A',
      'status': 'confirmed'
    },
    {
      'start_time': 'N/A',
      'end_time': 'N/A',
      'service_name': 'N/A',
      'customer_name': 'N/A',
      'customer_phone': 'N/A',
      'status': 'confirmed'
    },
    {
      'start_time': 'N/A',
      'end_time': 'N/A',
      'service_name': 'N/A',
      'customer_name': 'N/A',
      'customer_phone': 'N/A',
      'status': 'confirmed'
    },
    {
      'start_time': 'N/A',
      'end_time': 'N/A',
      'service_name': 'N/A',
      'customer_name': 'N/A',
      'customer_phone': 'N/A',
      'status': 'confirmed'
    },
    {
      'start_time': 'N/A',
      'end_time': 'N/A',
      'service_name': 'N/A',
      'customer_name': 'N/A',
      'customer_phone': 'N/A',
      'status': 'confirmed'
    },
    {
      'start_time': 'N/A',
      'end_time': 'N/A',
      'service_name': 'N/A',
      'customer_name': 'N/A',
      'customer_phone': 'N/A',
      'status': 'confirmed'
    }
  ];
  res.jsonp(data);

  var _setup = '';
  if (req.method === 'POST') {
    var body = req.body;
    if (body.length > 1e6) {
      req.connection.destroy();
    }
    var _temp = '';
    for (var key in body) {
      if (body.hasOwnProperty(key)) {
        _temp = key.toString();
      }
    }
    var _data = JSON.parse(_temp);
    var _id = _data.alias;
    var start = _data.start;
    var end = _data.end;
    var service = _data.service;
    var customer = _data.customer;
    // bat dau truy van
  }
};
exports.listservice = function(req, res) {
  Services.find().sort('name').exec(function(err, settingsaccounts) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(settingsaccounts);
    }
  });
};
/**
 * Create a Settingsaccount
 */
exports.create = function(req, res) {
  var settingsaccount = new Settingsaccount(req.body);
  settingsaccount.user = req.user;

  settingsaccount.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(settingsaccount);
    }
  });
};

/**
 * Show the current Settingsaccount
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var settingsaccount = req.settingsaccount ? req.settingsaccount.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  settingsaccount.isCurrentUserOwner = req.user && settingsaccount.user && settingsaccount.user._id.toString() === req.user._id.toString();

  res.jsonp(settingsaccount);
};

/**
 * Update a Settingsaccount
 */
exports.update = function(req, res) {
  var settingsaccount = req.settingsaccount;

  settingsaccount = _.extend(settingsaccount, req.body);

  settingsaccount.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(settingsaccount);
    }
  });
};

/**
 * Delete an Settingsaccount
 */
exports.delete = function(req, res) {
  var settingsaccount = req.settingsaccount;

  settingsaccount.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(settingsaccount);
    }
  });
};

/**
 * List of Settingsaccounts
 */
exports.list = function(req, res) {
  Staff.find({
    'full_name' : {'$exists': true}    
    ,'is_employee': 1
    ,'deleted': false
  }).sort('-created').exec(function(err, staffs) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(staffs);
    }
  });
};

/**
 * Settingsaccount middleware
 */
exports.settingsaccountByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Settingsaccount is invalid'
    });
  }

  Settingsaccount.findById(id).populate('user', 'displayName').exec(function (err, settingsaccount) {
    if (err) {
      return next(err);
    } else if (!settingsaccount) {
      return res.status(404).send({
        message: 'No Settingsaccount with that identifier has been found'
      });
    }
    req.settingsaccount = settingsaccount;
    next();
  });
};
exports.getcurrentuser = function(req, res) {
  var post = '';
  var _setup = '';
  if (req.method === 'POST') {
    var body = req.body;
    if (body.length > 1e6) {
      req.connection.destroy();
    }
    var _temp = '';
    for (var key in body) {
      if (body.hasOwnProperty(key)) {
        _temp = key.toString();
      }
    }
    var _data = JSON.parse(_temp);
    var _id = _data.customer;

    if (!mongoose.Types.ObjectId.isValid(_id)) {
      _id = mongoose.Types.ObjectId(_id);
    }
    
    Settingsaccount.findById(_id).exec(function (err, settingsaccounts) {
      if (err) {
        res.send(err);
      } else if (!settingsaccounts) {
        res.jsonp('No settingsaccounts with that identifier has been found');        
      }
      res.jsonp(settingsaccounts);
    });
  }
};
exports.quicksavedata = function(req, res) {
  var post = '';
  var _setup = '';
  if (req.method === 'POST') {
    var body = req.body;
    if (body.length > 1e6) {
      req.connection.destroy();
    }
    var _temp = '';
    for (var key in body) {
      if (body.hasOwnProperty(key)) {
        _temp = key.toString();
      }
    }
    var _data = JSON.parse(_temp);
    var _id = _data.key;
    var _option_key = _data.alias;
    var _option_val = _data.val;
    if (!mongoose.Types.ObjectId.isValid(_id)) {
      _id = mongoose.Types.ObjectId(_id);
    }
    Settingsaccount.findById(_id).exec(function (err, settingsaccounts) {
      if (err) {
        res.send('error');
      } else if (!settingsaccounts) {
        res.jsonp('No settingsaccounts with that identifier has been found');
      }      
      if (_option_key =='our_rep_id') {
        settingsaccounts.our_rep_id = mongoose.Types.ObjectId(_option_val.id);
        settingsaccounts.our_rep = _option_val.name;        
      } else {
        settingsaccounts[_option_key] = _option_val;
      }
      settingsaccounts.save(function(err, next) {
        if (err) {
          res.jsonp(err);
        } else {
          res.jsonp('Save successfully');
        }
      });
    });
  }
};
