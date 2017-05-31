(function () {
  'use strict';

  angular
    .module('customers')
    .controller('CustomersListController', CustomersListController);

  CustomersListController.$inject = ['$scope', '$state', '$window', 'CustomersService', 'Authentication', 'Notification', 'menuService', 'ModalService', 'AppointmentsService', 'AppointmentsByCustomerService'];

  function CustomersListController($scope, $state, $window, CustomersService, Authentication, Notification, menuService, ModalService, AppointmentsService, AppointmentsByCustomerService) {
    var vm = this;
    vm.Authentication = Authentication;
    vm.customers = CustomersService.query();
    vm.customer = null;
    vm.form = {};
    vm.loadview = loadview;
    vm.save = save;
    vm.remove = remove;
    vm.error = '';
    vm.addAppointment = addAppointment;
    vm.updateAppointment = updateAppointment;
    vm.listAppointment = [];

    $scope.changeTitle = menuService.changeTitle;
    $scope.changeTitle('Customers');

    function loadListAppointment(customer_id){
      var resource = AppointmentsByCustomerService.getAppointmentByCustomer();
      vm.listAppointment = [];
      resource.getAppointment({ customerIdAppointment: customer_id }).$promise.then(function(data) {
        for(var i = 0; i < data.length; i++) {
          data[i].datetime = new Date(data[i].datetime);
          vm.listAppointment.push(data[i]);
        }
        console.log(vm.listAppointment);
      });
    }

    function loadview(_customer) {
      close(1);
      if (_customer == null) {
        vm.customer = new CustomersService();
      } else {
        vm.customer = _customer;
        if(vm.customer._id){
          loadListAppointment(vm.customer._id);
        }
      }
    }

    function remove(_customer) {
      if ($window.confirm('Are you sure you want to delete?')) {
        _customer.$remove(function() {
          vm.customers = CustomersService.query();
          Notification.warning({ message: '<i class="glyphicon glyphicon-ok"></i> Delete customer successful!' });
          vm.customer = null;
        });
      }
    }

    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.customerForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.customer._id) {
        vm.customer.$update(successCallback, errorCallback);
      } else {
        vm.customer.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        Notification.success({ message: '<i class="glyphicon glyphicon-ok"></i> Create customer successful!' });
        vm.customers = CustomersService.query();
      }

      function errorCallback(res) {
        Notification.error({ message: '<i class="glyphicon glyphicon-remove"></i>' + res.data.message });
      }
    }

    function addAppointment() {
      ModalService.showModal({
        templateUrl: 'modules/appointments/client/views/modal-appointment.client.view.html',
        controller: 'AppointmentsController',
        controllerAs: 'vm',
        inputs: {
          appointmentResolve: new AppointmentsService(),
          customerResolve: vm.customer,
        }
      }).then(function(modal) {
        modal.element.modal();
        console.log(modal);
      });
    }

    function updateAppointment(id) {
      AppointmentsService.get({ appointmentId: id }).$promise.then(function(data) {
        ModalService.showModal({
          templateUrl: 'modules/appointments/client/views/modal-appointment.client.view.html',
          controller: 'AppointmentsController',
          controllerAs: 'vm',
          inputs: {
            appointmentResolve: data,
            customerResolve: vm.customer,
          }
        }).then(function(modal) {
          modal.element.modal();
          console.log(modal);
          modal.close.then(function(a,b,c){
            alert(123);
          });
        });
      });
      
    }
  }
}());
