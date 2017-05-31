'use strict';

/**
 * Module dependencies
 */
var salesreportsPolicy = require('../policies/salesreports.server.policy'),
  salesreports = require('../controllers/salesreports.server.controller');

module.exports = function(app) {
  // Salesreports Routes
  app.route('/api/salesreports').all(salesreportsPolicy.isAllowed)
    .get(salesreports.list)
    .post(salesreports.create);
  app.route('/api/salesreports/getdata').all(salesreportsPolicy.isAllowed)
    .get(salesreports.getdata)
    .post(salesreports.getdata);
  app.route('/api/salesreports/getdatadates').all(salesreportsPolicy.isAllowed)
    .get(salesreports.getdatadates)
    .post(salesreports.getdatadates);
  app.route('/api/salesreports/:salesreportId').all(salesreportsPolicy.isAllowed)
    .get(salesreports.read)
    .put(salesreports.update)
    .delete(salesreports.delete);

  // Finish by binding the Salesreport middleware
  app.param('salesreportId', salesreports.salesreportByID);
};
