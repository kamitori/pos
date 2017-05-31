'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Mainstation = mongoose.model('Mainstation'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a Mainstation
 */
exports.create = function(req, res) {
  var mainstation = new Mainstation(req.body);
  mainstation.user = req.user;

  mainstation.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(mainstation);
    }
  });
};

/**
 * Show the current Mainstation
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var mainstation = req.mainstation ? req.mainstation.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  mainstation.isCurrentUserOwner = req.user && mainstation.user && mainstation.user._id.toString() === req.user._id.toString();

  res.jsonp(mainstation);
};

/**
 * Update a Mainstation
 */
exports.update = function(req, res) {
  var mainstation = req.mainstation;

  mainstation = _.extend(mainstation, req.body);

  mainstation.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(mainstation);
    }
  });
};

/**
 * Delete an Mainstation
 */
exports.delete = function(req, res) {
  var mainstation = req.mainstation;

  mainstation.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(mainstation);
    }
  });
};

/**
 * List of Mainstations
 */
exports.list = function(req, res) {
  Mainstation.find().sort('-created').populate('user', 'displayName').exec(function(err, mainstations) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(mainstations);
    }
  });
};

/**
 * Mainstation middleware
 */
exports.mainstationByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Mainstation is invalid'
    });
  }

  Mainstation.findById(id).populate('user', 'displayName').exec(function (err, mainstation) {
    if (err) {
      return next(err);
    } else if (!mainstation) {
      return res.status(404).send({
        message: 'No Mainstation with that identifier has been found'
      });
    }
    req.mainstation = mainstation;
    next();
  });
};
