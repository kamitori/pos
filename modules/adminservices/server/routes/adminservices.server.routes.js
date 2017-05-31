'use strict';

/**
 * Module dependencies
 */
var adminservicesPolicy = require('../policies/adminservices.server.policy'),
  adminservices = require('../controllers/adminservices.server.controller');

module.exports = function(app) {
  // Adminservices Routes
  app.route('/api/adminservices').all(adminservicesPolicy.isAllowed)
    .get(adminservices.list)
    .post(adminservices.create);
  app.route('/api/adminservices/filterdata').all(adminservicesPolicy.isAllowed)
    .post(adminservices.filterdata);

  app.route('/api/adminservices/getServiceByCompany/:companyIdService').all(adminservicesPolicy.isAllowed)
    .get(adminservices.getServiceByCompany)
    .post(adminservices.deleteServiceFromCompany)
    .put(adminservices.updateServiceFromCompany);

  app.route('/api/adminservices/saveimage').all(adminservicesPolicy.isAllowed)
    .post(adminservices.uploadimage);

  app.route('/api/adminservices/:adminserviceId').all(adminservicesPolicy.isAllowed)
    .get(adminservices.read)
    .put(adminservices.update)
    .delete(adminservices.delete);

  // Finish by binding the Adminservice middleware
  app.param('adminserviceId', adminservices.adminserviceByID);
  app.param('companyIdService', adminservices.ServiceByCompany);
};
