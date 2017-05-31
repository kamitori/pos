'use strict';

/**
 * Module dependencies
 */
var adminsystemsPolicy = require('../policies/adminsystems.server.policy'),
  adminsystems = require('../controllers/adminsystems.server.controller');

module.exports = function(app) {
  // Adminsystems Routes
  app.route('/api/adminsystems').all(adminsystemsPolicy.isAllowed)
    .get(adminsystems.list)
    .post(adminsystems.create);

  app.route('/api/adminsystems/:adminsystemId').all(adminsystemsPolicy.isAllowed)
    .get(adminsystems.read)
    .put(adminsystems.update)
    .delete(adminsystems.delete);

  // Finish by binding the Adminsystem middleware
  app.param('adminsystemId', adminsystems.adminsystemByID);
};
