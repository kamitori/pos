// Adminservices service used to communicate Adminservices REST endpoints
(function () {
  'use strict';

  angular
    .module('adminservices')
    .factory('AdminservicesService', AdminservicesService)
    .factory('AdminservicesByCompanyService', AdminservicesByCompanyService);

  AdminservicesService.$inject = ['$resource'];

  function AdminservicesService($resource) {
    return $resource('/api/adminservices/:adminserviceId', {
      adminserviceId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }


  AdminservicesByCompanyService.$inject = ['$resource']

  function AdminservicesByCompanyService($resource){
    var service;
    service = {
      getServiceByCompany: getServiceByCompany
    };
    function getServiceByCompany() {
      return $resource('/api/adminservices/getServiceByCompany/:companyIdService',{},
      {
        getAdminservices: { method: 'GET', params: { companyIdService:'@company' }, isArray: true },
        removeService: { method: 'POST', params: { companyIdService:'@company' } },
        update: { method: 'PUT', params: { companyIdService:'@company' } }
      });
    }
    return service;
  }


}());
