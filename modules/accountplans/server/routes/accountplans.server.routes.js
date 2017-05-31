'use strict';

/**
 * Module dependencies
 */
var accountplansPolicy = require('../policies/accountplans.server.policy'),
  accountplans = require('../controllers/accountplans.server.controller');

module.exports = function(app) {
  // Accountplans Routes
  app.route('/api/accountplans').all(accountplansPolicy.isAllowed)
    .get(accountplans.list)
    .post(accountplans.create);

  app.route('/api/accountplans/:accountplanId').all(accountplansPolicy.isAllowed)
    .get(accountplans.read)
    .put(accountplans.update)
    .delete(accountplans.delete);

  // Finish by binding the Accountplan middleware
  app.param('accountplanId', accountplans.accountplanByID);
};
