'use strict';

/**
 * Module dependencies
 */
var restaurantsPolicy = require('../policies/restaurants.server.policy'),
  restaurants = require('../controllers/restaurants.server.controller');

module.exports = function(app) {
  // Restaurants Routes
  app.route('/api/restaurants').all(restaurantsPolicy.isAllowed)
    .get(restaurants.list)
    .put(restaurants.getList)
    .post(restaurants.create);

  app.route('/api/restaurants/:restaurantId').all(restaurantsPolicy.isAllowed)
    .get(restaurants.read)
    .put(restaurants.update)
    .delete(restaurants.delete);

  // Finish by binding the Restaurant middleware
  app.param('restaurantId', restaurants.restaurantByID);
};
