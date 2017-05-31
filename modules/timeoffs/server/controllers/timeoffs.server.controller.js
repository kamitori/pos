'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Timeoff = mongoose.model('Timeoff'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a Timeoff
 */
exports.create = function(req, res) {
  var timeoff = new Timeoff(req.body);
  timeoff.user = req.user;

  timeoff.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(timeoff);
    }
  });
};

/**
 * Show the current Timeoff
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var timeoff = req.timeoff ? req.timeoff.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  timeoff.isCurrentUserOwner = req.user && timeoff.user && timeoff.user._id.toString() === req.user._id.toString();

  res.jsonp(timeoff);
};

/**
 * Update a Timeoff
 */
exports.update = function(req, res) {
  var timeoff = req.timeoff;

  timeoff = _.extend(timeoff, req.body);

  timeoff.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(timeoff);
    }
  });
};

/**
 * Delete an Timeoff
 */
exports.delete = function(req, res) {
  var timeoff = req.timeoff;

  timeoff.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(timeoff);
    }
  });
};

/**
 * List of Timeoffs
 */
exports.list = function(req, res) {
  Timeoff.find().sort('-created').populate('user', 'displayName').exec(function(err, timeoffs) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(timeoffs);
    }
  });
};

/**
 * Timeoff middleware
 */
exports.timeoffByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Timeoff is invalid'
    });
  }

  Timeoff.findById(id).populate('user', 'displayName').exec(function (err, timeoff) {
    if (err) {
      return next(err);
    } else if (!timeoff) {
      return res.status(404).send({
        message: 'No Timeoff with that identifier has been found'
      });
    }
    req.timeoff = timeoff;
    next();
  });
};
