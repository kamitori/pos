'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Adminsetup = mongoose.model('Adminsetup'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a Adminsetup
 */
exports.create = function(req, res) {
  var adminsetup = new Adminsetup(req.body);
  adminsetup.user = req.user;

  adminsetup.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(adminsetup);
    }
  });
};

/**
 * Show the current Adminsetup
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var adminsetup = req.adminsetup ? req.adminsetup.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  adminsetup.isCurrentUserOwner = req.user && adminsetup.user && adminsetup.user._id.toString() === req.user._id.toString();

  res.jsonp(adminsetup);
};

/**
 * Update a Adminsetup
 */
exports.update = function(req, res) {
  var adminsetup = req.adminsetup;

  adminsetup = _.extend(adminsetup, req.body);

  adminsetup.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(adminsetup);
    }
  });
};

/**
 * Delete an Adminsetup
 */
exports.delete = function(req, res) {
  var adminsetup = req.adminsetup;

  adminsetup.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(adminsetup);
    }
  });
};

/**
 * List of Adminsetups
 */
exports.list = function(req, res) {
  Adminsetup.find().sort('-created').populate('user', 'displayName').exec(function(err, adminsetups) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(adminsetups);
    }
  });
};

/**
 * Adminsetup middleware
 */
exports.adminsetupByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Adminsetup is invalid'
    });
  }

  Adminsetup.findById(id).populate('user', 'displayName').exec(function (err, adminsetup) {
    if (err) {
      return next(err);
    } else if (!adminsetup) {
      return res.status(404).send({
        message: 'No Adminsetup with that identifier has been found'
      });
    }
    req.adminsetup = adminsetup;
    next();
  });
};
