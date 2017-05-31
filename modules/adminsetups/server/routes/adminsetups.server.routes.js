'use strict';

/**
 * Module dependencies
 */
var adminsetupsPolicy = require('../policies/adminsetups.server.policy'),
  adminsetups = require('../controllers/adminsetups.server.controller');

module.exports = function(app) {
  // Adminsetups Routes
  app.route('/api/adminsetups').all(adminsetupsPolicy.isAllowed)
    .get(adminsetups.list)
    .post(adminsetups.create);

  app.route('/api/adminsetups/:adminsetupId').all(adminsetupsPolicy.isAllowed)
    .get(adminsetups.read)
    .put(adminsetups.update)
    .delete(adminsetups.delete);

  // Finish by binding the Adminsetup middleware
  app.param('adminsetupId', adminsetups.adminsetupByID);
};
