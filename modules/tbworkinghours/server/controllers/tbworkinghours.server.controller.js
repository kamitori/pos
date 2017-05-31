'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Tbworkinghour = mongoose.model('Tbworkinghour'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a Tbworkinghour
 */
exports.create = function(req, res) {
  var tbworkinghour = new Tbworkinghour(req.body);
  tbworkinghour.user = req.user;

  tbworkinghour.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(tbworkinghour);
    }
  });
};

/**
 * Show the current Tbworkinghour
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var tbworkinghour = req.tbworkinghour ? req.tbworkinghour.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  tbworkinghour.isCurrentUserOwner = req.user && tbworkinghour.user && tbworkinghour.user._id.toString() === req.user._id.toString();

  res.jsonp(tbworkinghour);
};

/**
 * Update a Tbworkinghour
 */
exports.update = function(req, res) {
  var tbworkinghour = req.tbworkinghour;

  tbworkinghour = _.extend(tbworkinghour, req.body);

  tbworkinghour.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(tbworkinghour);
    }
  });
};

/**
 * Delete an Tbworkinghour
 */
exports.delete = function(req, res) {
  var tbworkinghour = req.tbworkinghour;

  tbworkinghour.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(tbworkinghour);
    }
  });
};

/**
 * List of Tbworkinghours
 */
exports.list = function(req, res) {
  Tbworkinghour.find().sort('-created').populate('user', 'displayName').exec(function(err, tbworkinghours) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(tbworkinghours);
    }
  });
};

/**
 * Tbworkinghour middleware
 */
exports.tbworkinghourByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Tbworkinghour is invalid'
    });
  }

  Tbworkinghour.findById(id).populate('user', 'displayName').exec(function (err, tbworkinghour) {
    if (err) {
      return next(err);
    } else if (!tbworkinghour) {
      return res.status(404).send({
        message: 'No Tbworkinghour with that identifier has been found'
      });
    }
    req.tbworkinghour = tbworkinghour;
    next();
  });
};
