(function () {
  'use strict';

  angular
    .module('accountplans')
    .controller('AccountplansListController', AccountplansListController);

  AccountplansListController.$inject = ['$scope', 'AccountplansService', 'ModalService', 'menuService'];

  function AccountplansListController($scope, AccountplansService, ModalService, menuService) {
    var vm = this;

    vm.accountplans = AccountplansService.query();

    $scope.changeTitle = menuService.changeTitle;
    $scope.changeTitle('Upgrade Account Plan');

    vm.closeModal = function() {
      close(1);
    };
    vm.showModal = function () {
      ModalService.showModal({
        templateUrl: '/modules/accountplans/client/views/chooseplan-accountplan.client.view.html',
        controller: 'AccountplansListController'
      }).then(function(modal) {
        modal.element.modal();
        modal.close.then(function(result) {
        });
      });
    };
  }
}());
