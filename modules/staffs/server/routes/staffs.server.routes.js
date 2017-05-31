'use strict';

/**
 * Module dependencies
 */
var staffsPolicy = require('../policies/staffs.server.policy'),
  staffs = require('../controllers/staffs.server.controller');

module.exports = function(app) {
  // Staffs Routes
  app.route('/api/staffs').all(staffsPolicy.isAllowed)
    .get(staffs.list)
    .post(staffs.create);
  app.route('/api/staffs/getStaffByCompany/:companyIdStaff').all(staffsPolicy.isAllowed)
    .get(staffs.getStaffByCompany)
    .put(staffs.updateStaffFromCompany)
    .post(staffs.deleteStaffFromCompany);
  app.route('/api/staffs/saveimage').all(staffsPolicy.isAllowed)
    .post(staffs.uploadimage);
  app.route('/api/staffs/getworkinghoursdata').all(staffsPolicy.isAllowed)
    .post(staffs.getworkinghoursdata);
  app.route('/api/staffs/getdata/listservice').all(staffsPolicy.isAllowed)
    .get(staffs.getlistservice)
    .post(staffs.getlistservice);
  app.route('/api/staffs/quicksave/quickadd').all(staffsPolicy.isAllowed)
    .post(staffs.quicksavedata);
  app.route('/api/staffs/:staffId').all(staffsPolicy.isAllowed)
    .get(staffs.read)
    .put(staffs.update)
    .delete(staffs.delete);

  // Finish by binding the Staff middleware
  app.param('staffId', staffs.staffByID);
  app.param('companyIdStaff', staffs.staffByCompany);

};
