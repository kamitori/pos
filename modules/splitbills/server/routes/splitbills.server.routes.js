'use strict';

/**
 * Module dependencies
 */
var splitbillsPolicy = require('../policies/splitbills.server.policy'),
  splitbills = require('../controllers/splitbills.server.controller');

module.exports = function(app) {
  // Splitbills Routes
  app.route('/api/splitbills').all(splitbillsPolicy.isAllowed)
    .get(splitbills.list)
    .post(splitbills.create)
      .post(splitbills.split);

  app.route('/api/splitbills/:splitbillId').all(splitbillsPolicy.isAllowed)
    .get(splitbills.read)
    .put(splitbills.update)
    .delete(splitbills.delete);

  // Finish by binding the Splitbill middleware
  app.param('splitbillId', splitbills.splitbillByID);
};
