'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Appintegration = mongoose.model('Appintegration'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a Appintegration
 */
exports.create = function(req, res) {
  var appintegration = new Appintegration(req.body);
  appintegration.user = req.user;

  appintegration.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(appintegration);
    }
  });
};

/**
 * Show the current Appintegration
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var appintegration = req.appintegration ? req.appintegration.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  appintegration.isCurrentUserOwner = req.user && appintegration.user && appintegration.user._id.toString() === req.user._id.toString();

  res.jsonp(appintegration);
};

/**
 * Update a Appintegration
 */
exports.update = function(req, res) {
  var appintegration = req.appintegration;

  appintegration = _.extend(appintegration, req.body);

  appintegration.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(appintegration);
    }
  });
};

/**
 * Delete an Appintegration
 */
exports.delete = function(req, res) {
  var appintegration = req.appintegration;

  appintegration.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(appintegration);
    }
  });
};

/**
 * List of Appintegrations
 */
exports.list = function(req, res) {
  Appintegration.find().sort('-created').populate('user', 'displayName').exec(function(err, appintegrations) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(appintegrations);
    }
  });
};

/**
 * Appintegration middleware
 */
exports.appintegrationByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Appintegration is invalid'
    });
  }

  Appintegration.findById(id).populate('user', 'displayName').exec(function (err, appintegration) {
    if (err) {
      return next(err);
    } else if (!appintegration) {
      return res.status(404).send({
        message: 'No Appintegration with that identifier has been found'
      });
    }
    req.appintegration = appintegration;
    next();
  });
};
