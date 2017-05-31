'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Restaurant = mongoose.model('Restaurant'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a Restaurant
 */
exports.create = function(req, res) {
  var restaurant = new Restaurant(req.body);
  restaurant.user = req.user;

  restaurant.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(restaurant);
    }
  });
};

/**
 * Show the current Restaurant
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var restaurant = req.restaurant ? req.restaurant.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  restaurant.isCurrentUserOwner = req.user && restaurant.user && restaurant.user._id.toString() === req.user._id.toString();

  res.jsonp(restaurant);
};

/**
 * Update a Restaurant
 */
exports.update = function(req, res) {
  var restaurant = req.restaurant;

  restaurant = _.extend(restaurant, req.body);

  restaurant.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(restaurant);
    }
  });
};

/**
 * Delete an Restaurant
 */
exports.delete = function(req, res) {
  var restaurant = req.restaurant;

  restaurant.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(restaurant);
    }
  });
};

/**
 * List of Restaurants
 */
exports.list = function(req, res) {
  Restaurant.find().sort('-created').populate('user', 'displayName').exec(function(err, restaurants) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(restaurants);
    }
  });
};

/**
 * Get List of Restaurants By Param
 */
exports.getList = function(req, res) {
  if(req.body.companyListRestaurant){
    Restaurant.find({'_id':{ $in: req.body.companyListRestaurant}}).sort('-created').populate('user', 'displayName').exec(function(err, restaurants) {
      if (err) {
        return res.status(400).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else {
        res.jsonp(restaurants);
      }
    });
  }
  
};


/**
 * Restaurant middleware
 */
exports.restaurantByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Restaurant is invalid'
    });
  }

  Restaurant.findById(id).populate('user', 'displayName').exec(function (err, restaurant) {
    if (err) {
      return next(err);
    } else if (!restaurant) {
      return res.status(404).send({
        message: 'No Restaurant with that identifier has been found'
      });
    }
    req.restaurant = restaurant;
    next();
  });
};
