'use strict';

/**
 * Module dependencies
 */
var settingsaccountsPolicy = require('../policies/settingsaccounts.server.policy'),
  settingsaccounts = require('../controllers/settingsaccounts.server.controller');

module.exports = function(app) {
  // Settingsaccounts Routes
  app.route('/api/settingsaccounts').all(settingsaccountsPolicy.isAllowed)
    .get(settingsaccounts.list)
    .post(settingsaccounts.create);
  app.route('/api/settingsaccounts/listservice').all(settingsaccountsPolicy.isAllowed)
    .get(settingsaccounts.listservice);
  app.route('/api/settingsaccounts/listcustomers').all(settingsaccountsPolicy.isAllowed)
    .post(settingsaccounts.listcustomers);
  app.route('/api/settingsaccounts/getcurrentuser').all(settingsaccountsPolicy.isAllowed)
    .post(settingsaccounts.getcurrentuser);
  app.route('/api/settingsaccounts/quicksave').all(settingsaccountsPolicy.isAllowed)
    .post(settingsaccounts.quicksavedata);
  // Finish by binding the Settingsaccount middleware
  app.param('settingsaccountId', settingsaccounts.settingsaccountByID);
};
