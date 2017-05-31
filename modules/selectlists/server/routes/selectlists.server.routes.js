'use strict';

/**
 * Module dependencies
 */
var selectlistsPolicy = require('../policies/selectlists.server.policy'),
  selectlists = require('../controllers/selectlists.server.controller');

module.exports = function(app) {
  // Selectlists Routes
  app.route('/api/selectlists').all(selectlistsPolicy.isAllowed)
    .get(selectlists.list)
    .post(selectlists.create);

  app.route('/api/selectlists/:selectlistId').all(selectlistsPolicy.isAllowed)
    .get(selectlists.read)
    .put(selectlists.update)
    .delete(selectlists.delete);

  // Finish by binding the Selectlist middleware
  app.param('selectlistId', selectlists.selectlistByID);
};
