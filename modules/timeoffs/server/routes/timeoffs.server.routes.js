'use strict';

/**
 * Module dependencies
 */
var timeoffsPolicy = require('../policies/timeoffs.server.policy'),
  timeoffs = require('../controllers/timeoffs.server.controller');

module.exports = function(app) {
  // Timeoffs Routes
  app.route('/api/timeoffs').all(timeoffsPolicy.isAllowed)
    .get(timeoffs.list)
    .post(timeoffs.create);

  app.route('/api/timeoffs/:timeoffId').all(timeoffsPolicy.isAllowed)
    .get(timeoffs.read)
    .put(timeoffs.update)
    .delete(timeoffs.delete);

  // Finish by binding the Timeoff middleware
  app.param('timeoffId', timeoffs.timeoffByID);
};
