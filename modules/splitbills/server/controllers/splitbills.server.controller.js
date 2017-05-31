'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Splitbill = mongoose.model('Splitbill'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Split bill
 */
exports.split = function(req, res) {
  var splitbill = new Splitbill(req.body);
  splitbill.user = req.user;

  res.jsonp(splitbill);
};

/**
 * Create a Splitbill
 */
exports.create = function(req, res) {
  var splitbill = new Splitbill(req.body);
  splitbill.user = req.user;

  splitbill.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(splitbill);
    }
  });
};

/**
 * Show the current Splitbill
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var splitbill = req.splitbill ? req.splitbill.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  splitbill.isCurrentUserOwner = req.user && splitbill.user && splitbill.user._id.toString() === req.user._id.toString();

  res.jsonp(splitbill);
};

/**
 * Update a Splitbill
 */
exports.update = function(req, res) {
  var splitbill = req.splitbill;

  splitbill = _.extend(splitbill, req.body);

  splitbill.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(splitbill);
    }
  });
};

/**
 * Delete an Splitbill
 */
exports.delete = function(req, res) {
  var splitbill = req.splitbill;

  splitbill.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(splitbill);
    }
  });
};

/**
 * List of Splitbills
 */
exports.list = function(req, res) {
  Splitbill.find().sort('-created').populate('user', 'displayName').exec(function(err, splitbills) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(splitbills);
    }
  });
};

/**
 * Splitbill middleware
 */
exports.splitbillByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Splitbill is invalid'
    });
  }

  Splitbill.findById(id).populate('user', 'displayName').exec(function (err, splitbill) {
    if (err) {
      return next(err);
    } else if (!splitbill) {
      return res.status(404).send({
        message: 'No Splitbill with that identifier has been found'
      });
    }
    req.splitbill = splitbill;
    next();
  });
};
