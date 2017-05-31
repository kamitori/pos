'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Accountplan = mongoose.model('Accountplan'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a Accountplan
 */
exports.create = function(req, res) {
  var accountplan = new Accountplan(req.body);
  accountplan.user = req.user;

  accountplan.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(accountplan);
    }
  });
};

/**
 * Show the current Accountplan
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var accountplan = req.accountplan ? req.accountplan.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  accountplan.isCurrentUserOwner = req.user && accountplan.user && accountplan.user._id.toString() === req.user._id.toString();

  res.jsonp(accountplan);
};

/**
 * Update a Accountplan
 */
exports.update = function(req, res) {
  var accountplan = req.accountplan;

  accountplan = _.extend(accountplan, req.body);

  accountplan.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(accountplan);
    }
  });
};

/**
 * Delete an Accountplan
 */
exports.delete = function(req, res) {
  var accountplan = req.accountplan;

  accountplan.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(accountplan);
    }
  });
};

/**
 * List of Accountplans
 */
exports.list = function(req, res) {
  Accountplan.find().sort('-created').populate('user', 'displayName').exec(function(err, accountplans) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(accountplans);
    }
  });
};

/**
 * Accountplan middleware
 */
exports.accountplanByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Accountplan is invalid'
    });
  }

  Accountplan.findById(id).populate('user', 'displayName').exec(function (err, accountplan) {
    if (err) {
      return next(err);
    } else if (!accountplan) {
      return res.status(404).send({
        message: 'No Accountplan with that identifier has been found'
      });
    }
    req.accountplan = accountplan;
    next();
  });
};
