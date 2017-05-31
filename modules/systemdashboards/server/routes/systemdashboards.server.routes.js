'use strict';

/**
 * Module dependencies
 */
var systemdashboardsPolicy = require('../policies/systemdashboards.server.policy'),
  systemdashboards = require('../controllers/systemdashboards.server.controller');

module.exports = function(app) {
  // Systemdashboards Routes
  app.route('/api/systemdashboards').all(systemdashboardsPolicy.isAllowed)
    .get(systemdashboards.list)
    .post(systemdashboards.create);

  app.route('/api/systemdashboards/:systemdashboardId').all(systemdashboardsPolicy.isAllowed)
    .get(systemdashboards.read)
    .put(systemdashboards.update)
    .delete(systemdashboards.delete);

  // Finish by binding the Systemdashboard middleware
  app.param('systemdashboardId', systemdashboards.systemdashboardByID);
};
