'use strict';

/**
 * Module dependencies
 */
var appintegrationsPolicy = require('../policies/appintegrations.server.policy'),
  appintegrations = require('../controllers/appintegrations.server.controller');

module.exports = function(app) {
  // Appintegrations Routes
  app.route('/api/appintegrations').all(appintegrationsPolicy.isAllowed)
    .get(appintegrations.list)
    .post(appintegrations.create);

  app.route('/api/appintegrations/:appintegrationId').all(appintegrationsPolicy.isAllowed)
    .get(appintegrations.read)
    .put(appintegrations.update)
    .delete(appintegrations.delete);

  // Finish by binding the Appintegration middleware
  app.param('appintegrationId', appintegrations.appintegrationByID);
};
