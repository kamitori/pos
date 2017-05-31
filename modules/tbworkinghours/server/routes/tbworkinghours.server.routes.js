'use strict';

/**
 * Module dependencies
 */
var tbworkinghoursPolicy = require('../policies/tbworkinghours.server.policy'),
  tbworkinghours = require('../controllers/tbworkinghours.server.controller');

module.exports = function(app) {
  // Tbworkinghours Routes
  app.route('/api/tbworkinghours').all(tbworkinghoursPolicy.isAllowed)
    .get(tbworkinghours.list)
    .post(tbworkinghours.create);

  app.route('/api/tbworkinghours/:tbworkinghourId').all(tbworkinghoursPolicy.isAllowed)
    .get(tbworkinghours.read)
    .put(tbworkinghours.update)
    .delete(tbworkinghours.delete);

  // Finish by binding the Tbworkinghour middleware
  app.param('tbworkinghourId', tbworkinghours.tbworkinghourByID);
};
