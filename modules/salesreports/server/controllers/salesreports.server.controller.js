'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Salesreport = mongoose.model('Salesreport'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a Salesreport
 */
exports.create = function(req, res) {
  var salesreport = new Salesreport(req.body);
  salesreport.user = req.user;

  salesreport.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(salesreport);
    }
  });
};

/**
 * Show the current Salesreport
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var salesreport = req.salesreport ? req.salesreport.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  salesreport.isCurrentUserOwner = req.user && salesreport.user && salesreport.user._id.toString() === req.user._id.toString();

  res.jsonp(salesreport);
};

/**
 * Update a Salesreport
 */
exports.update = function(req, res) {
  var salesreport = req.salesreport;

  salesreport = _.extend(salesreport, req.body);

  salesreport.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(salesreport);
    }
  });
};

/**
 * Delete an Salesreport
 */
exports.delete = function(req, res) {
  var salesreport = req.salesreport;

  salesreport.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(salesreport);
    }
  });
};

exports.getdatadates = function(req, res) {
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
    var id = '';
    var _start = _data.start;
    var _end = _data.end;
    var _arr_start = _start.split('-');
    var _arr_end = _end.split('-');
    
    var _where = {
      'salesorder_date': {
        '$gte': new Date(_arr_start[2], _arr_start[1], _arr_start[0]),
        '$lte': new Date(_arr_end[2], _arr_end[1], _arr_end[0])
      }
    };
    Salesreport.find(_where).populate('user', 'displayName').exec(function(err, salesreports) {
      if (err) {
        return res.status(400).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else {
        res.jsonp(salesreports);
      }
    });
  }
}
exports.getdata = function(req, res) {
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
    var id = '';
    var day = 1;
    if (_data.id) id = _data.id;
    if (_data.day) day = _data.day;
    var _arr = id.split('-');
    var _date = new Date(2017, 4, 24);
    var _where = {
      'salesorder_date': {
        '$gte': new Date(_arr[2], _arr[1], _arr[0]),
        '$lte': new Date(_arr[2], _arr[1], (parseInt(_arr[0],10) + day))
      }
    };
    Salesreport.find(_where).populate('user', 'displayName').exec(function(err, salesreports) {
      if (err) {
        return res.status(400).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else {
        res.jsonp(salesreports);
      }
    });
  }
}
/**
 * List of Salesreports
 */
exports.list = function(req, res) {
  Salesreport.find().sort('-created').populate('user', 'displayName').exec(function(err, salesreports) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(salesreports);
    }
  });
};

/**
 * Salesreport middleware
 */
exports.salesreportByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Salesreport is invalid'
    });
  }

  Salesreport.findById(id).populate('user', 'displayName').exec(function (err, salesreport) {
    if (err) {
      return next(err);
    } else if (!salesreport) {
      return res.status(404).send({
        message: 'No Salesreport with that identifier has been found'
      });
    }
    req.salesreport = salesreport;
    next();
  });
};
