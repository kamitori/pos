'use strict';

/**
 * Module dependencies
 */
var mainstationsPolicy = require('../policies/mainstations.server.policy'),
  mainstations = require('../controllers/mainstations.server.controller');

module.exports = function(app) {
  // Mainstations Routes
  app.route('/api/mainstations').all(mainstationsPolicy.isAllowed)
    .get(mainstations.list)
    .post(mainstations.create);

  app.route('/api/mainstations/:mainstationId').all(mainstationsPolicy.isAllowed)
    .get(mainstations.read)
    .put(mainstations.update)
    .delete(mainstations.delete);

  // Finish by binding the Mainstation middleware
  app.param('mainstationId', mainstations.mainstationByID);
};
