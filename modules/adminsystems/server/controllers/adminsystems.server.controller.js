'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Adminsystem = mongoose.model('Adminsystem'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a Adminsystem
 */
exports.create = function(req, res) {
  var adminsystem = new Adminsystem(req.body);
  adminsystem.user = req.user;

  adminsystem.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(adminsystem);
    }
  });
};

/**
 * Show the current Adminsystem
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var adminsystem = req.adminsystem ? req.adminsystem.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  adminsystem.isCurrentUserOwner = req.user && adminsystem.user && adminsystem.user._id.toString() === req.user._id.toString();

  res.jsonp(adminsystem);
};

/**
 * Update a Adminsystem
 */
exports.update = function(req, res) {
  var adminsystem = req.adminsystem;

  adminsystem = _.extend(adminsystem, req.body);

  adminsystem.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(adminsystem);
    }
  });
};

/**
 * Delete an Adminsystem
 */
exports.delete = function(req, res) {
  var adminsystem = req.adminsystem;

  adminsystem.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(adminsystem);
    }
  });
};

/**
 * List of Adminsystems
 */
exports.list = function(req, res) {
  Adminsystem.find().sort('-created').populate('user', 'displayName').exec(function(err, adminsystems) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(adminsystems);
    }
  });
};

/**
 * Adminsystem middleware
 */
exports.adminsystemByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Adminsystem is invalid'
    });
  }

  Adminsystem.findById(id).populate('user', 'displayName').exec(function (err, adminsystem) {
    if (err) {
      return next(err);
    } else if (!adminsystem) {
      return res.status(404).send({
        message: 'No Adminsystem with that identifier has been found'
      });
    }
    req.adminsystem = adminsystem;
    next();
  });
};
