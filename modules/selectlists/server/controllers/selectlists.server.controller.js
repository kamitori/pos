'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Selectlist = mongoose.model('Selectlist'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a Selectlist
 */
exports.create = function(req, res) {
  var selectlist = new Selectlist(req.body);
  selectlist.user = req.user;

  selectlist.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(selectlist);
    }
  });
};

/**
 * Show the current Selectlist
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var selectlist = req.selectlist ? req.selectlist.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  selectlist.isCurrentUserOwner = req.user && selectlist.user && selectlist.user._id.toString() === req.user._id.toString();

  res.jsonp(selectlist);
};

/**
 * Update a Selectlist
 */
exports.update = function(req, res) {
  var selectlist = req.selectlist;

  selectlist = _.extend(selectlist, req.body);

  selectlist.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(selectlist);
    }
  });
};

/**
 * Delete an Selectlist
 */
exports.delete = function(req, res) {
  var selectlist = req.selectlist;

  selectlist.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(selectlist);
    }
  });
};

/**
 * List of Selectlists
 */
exports.list = function(req, res) {
  Selectlist.find().sort('-created').populate('user', 'displayName').exec(function(err, selectlists) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(selectlists);
    }
  });
};

/**
 * Selectlist middleware
 */
exports.selectlistByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Selectlist is invalid'
    });
  }

  Selectlist.findById(id).populate('user', 'displayName').exec(function (err, selectlist) {
    if (err) {
      return next(err);
    } else if (!selectlist) {
      return res.status(404).send({
        message: 'No Selectlist with that identifier has been found'
      });
    }
    req.selectlist = selectlist;
    next();
  });
};
