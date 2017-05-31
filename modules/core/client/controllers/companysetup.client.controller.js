(function () {
  'use strict';

  angular
    .module('core')
    .controller('CompanySetupController', CompanySetupController);

  CompanySetupController.$inject = ['$scope', '$state', 'Authentication', 'ModalService', 'CompaniesService', '$location'];

  function CompanySetupController($scope, $state, Authentication, ModalService, CompaniesService, $location) {
    var vm = this;
    user.showCompany = -1;
    vm.company = null;
    var hash = $location.hash();
    var arr_hash = hash.split('/');
    user.showCompany = arr_hash.indexOf('company');
    if(user.company == null || user.showCompany >= 0) {
      if(user.company == null){
        vm.company = new CompaniesService();
      }else{
        vm.company = getCompany(user.company._id,CompaniesService);
      }
      var _modal_create = ModalService.showModal({
        templateUrl: 'modules/core/client/views/wizard-company.client.view.html',
        controller: 'CompaniesController',
        controllerAs: 'vm',
        inputs: {
          companyResolve: vm.company
        }
      }).then(function(modal) {
        modal.element.modal();
      });
    }


    function getCompany(companyId, CompaniesService) {
      return CompaniesService.get({
        companyId: companyId
      });
    }
  }
}());
