// Staffs service used to communicate Staffs REST endpoints
(function () {
  'use strict';

  angular
    .module('staffs')
    .factory('StaffsService', StaffsService)
    .factory('StaffsByCompanyService', StaffsByCompanyService);

  StaffsService.$inject = ['$resource'];

  function StaffsService($resource) {
    return $resource('/api/staffs/:staffId', {
      staffId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }

  StaffsByCompanyService.$inject = ['$resource'];

  function StaffsByCompanyService($resource) {
    var service;
    service = {
      getStaffByCompany: getStaffByCompany
    };
    function getStaffByCompany() {
      return $resource('/api/staffs/getStaffByCompany/:companyIdStaff', {}, {
        getStaffs: { method: 'GET', params: { companyIdStaff: '@company' }, isArray: true },
        removeStaff: { method: 'POST', params: { companyIdStaff: '@company' } },
        update: { method: 'PUT', params: { companyIdStaff: '@company' } }
      });
    }
    return service;
  }
}());
