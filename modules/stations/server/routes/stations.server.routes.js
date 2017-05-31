'use strict';

/**
 * Module dependencies
 */
var stationsPolicy = require('../policies/stations.server.policy'),
  stations = require('../controllers/stations.server.controller');

module.exports = function(app) {
  // Stations Routes
  app.route('/api/stations').all(stationsPolicy.isAllowed)
    .get(stations.list)
    .post(stations.create);

  app.route('/api/stations/:stationId').all(stationsPolicy.isAllowed)
    .get(stations.read)
    .put(stations.update)
    .delete(stations.delete);

  // Finish by binding the Station middleware
  app.param('stationId', stations.stationByID);
};
