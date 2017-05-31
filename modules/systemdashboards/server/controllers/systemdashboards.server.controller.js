'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Systemdashboard = mongoose.model('Systemdashboard'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a Systemdashboard
 */
exports.create = function(req, res) {
  var systemdashboard = new Systemdashboard(req.body);
  systemdashboard.user = req.user;

  systemdashboard.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(systemdashboard);
    }
  });
};

/**
 * Show the current Systemdashboard
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var systemdashboard = req.systemdashboard ? req.systemdashboard.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  systemdashboard.isCurrentUserOwner = req.user && systemdashboard.user && systemdashboard.user._id.toString() === req.user._id.toString();

  res.jsonp(systemdashboard);
};

/**
 * Update a Systemdashboard
 */
exports.update = function(req, res) {
  var systemdashboard = req.systemdashboard;

  systemdashboard = _.extend(systemdashboard, req.body);

  systemdashboard.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(systemdashboard);
    }
  });
};

/**
 * Delete an Systemdashboard
 */
exports.delete = function(req, res) {
  var systemdashboard = req.systemdashboard;

  systemdashboard.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(systemdashboard);
    }
  });
};

/**
 * List of Systemdashboards
 */
exports.list = function(req, res) {
  Systemdashboard.find().sort('-created').populate('user', 'displayName').exec(function(err, systemdashboards) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(systemdashboards);
    }
  });
};

/**
 * Systemdashboard middleware
 */
exports.systemdashboardByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Systemdashboard is invalid'
    });
  }

  Systemdashboard.findById(id).populate('user', 'displayName').exec(function (err, systemdashboard) {
    if (err) {
      return next(err);
    } else if (!systemdashboard) {
      return res.status(404).send({
        message: 'No Systemdashboard with that identifier has been found'
      });
    }
    req.systemdashboard = systemdashboard;
    next();
  });
};
