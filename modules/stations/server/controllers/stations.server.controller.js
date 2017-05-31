'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Station = mongoose.model('Station'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a Station
 */
exports.create = function(req, res) {
  var station = new Station(req.body);
  station.user = req.user;

  station.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(station);
    }
  });
};

/**
 * Show the current Station
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var station = req.station ? req.station.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  station.isCurrentUserOwner = req.user && station.user && station.user._id.toString() === req.user._id.toString();

  res.jsonp(station);
};

/**
 * Update a Station
 */
exports.update = function(req, res) {
  var station = req.station;

  station = _.extend(station, req.body);

  station.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(station);
    }
  });
};

/**
 * Delete an Station
 */
exports.delete = function(req, res) {
  var station = req.station;

  station.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(station);
    }
  });
};

/**
 * List of Stations
 */
exports.list = function(req, res) {
  Station.find().sort('-created').populate('user', 'displayName').exec(function(err, stations) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(stations);
    }
  });
};

/**
 * List of Stations
 */
exports.kitchen = function(req, res) {
  Station.find().sort('-created').populate('user', 'displayName').exec(function(err, stations) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(stations);
    }
  });
};

/**
 * Station middleware
 */
exports.stationByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Station is invalid'
    });
  }

  Station.findById(id).populate('user', 'displayName').exec(function (err, station) {
    if (err) {
      return next(err);
    } else if (!station) {
      return res.status(404).send({
        message: 'No Station with that identifier has been found'
      });
    }
    req.station = station;
    next();
  });
};
