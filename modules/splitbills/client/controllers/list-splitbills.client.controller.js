(function () {
  'use strict';

  angular
    .module('splitbills')
    .controller('SplitbillsListController', SplitbillsListController);

  SplitbillsListController.$inject = ['$scope', '$state', 'SplitbillsService', 'ModalService', 'menuService'];

  function SplitbillsListController($scope, $state, SplitbillsService, ModalService, menuService) {
    var vm = this;

    vm.splitbills = SplitbillsService.query();

    $scope.changeTitle = menuService.changeTitle;
    $scope.changeTitle('Split Bill');

    $scope.split = function(split_by) {
  		if(split_by == 'percentage'){

  		}
      setTimeout(function(){
        $state.go('splitbills.split');
      }, 500);

      // $state.reload();
  		
    };

    $scope.showSplitAction = function(id) {
      var show = document.getElementById(id);
      // console.log('display:'+show.style.display);
      if(show.style.display == 'none'){
      	show.style.display = 'block';
      } else {
      	show.style.display = 'none';
      }
    };

    vm.closeModal = function() {
      close(1);
    };
    vm.showModal = function () {
      ModalService.showModal({
        templateUrl: '/modules/splitbills/client/views/modal-splitbill.client.view.html',
        controller: 'SplitbillsListController'
      }).then(function(modal) {
        modal.element.modal();
        modal.close.then(function(result) {
        });
      });
    };

  }
}());
