(function () {
  'use strict';

  // Calendars controller
  angular
    .module('calendars')
    .controller('CalendarsController', CalendarsController);

  CalendarsController.$inject = ['$scope', '$state', '$window', 'Authentication', 'ModalService', 'Notification', 'AdminservicesService', 'StaffsService', 'CustomersService', 'StaffsByCompanyService', 'AdminservicesByCompanyService'];

  function CalendarsController ($scope, $state, $window, Authentication, ModalService, Notification, AdminservicesService, StaffsService, CustomersService, StaffsByCompanyService, AdminservicesByCompanyService) {
    var vm = this;
    var date = new Date();
    vm.d = date.getDate();
    vm.m = date.getMonth();
    vm.y = date.getFullYear();
    vm.alertMessage = '';
    vm.authentication = Authentication;
    vm.dayClick = dayClick;
    vm.eventRender = eventRender;
    vm.eventClick = eventClick;
    vm.addStaff = addStaff;
    vm.addCustomer = addCustomer;
    vm.addService = addService;
    vm.currentStaff = null;
    vm.changeStaff = changeStaff;

    // Get list Data
    vm.listService = [];
    vm.listStaff = [];
    vm.listCustomer = [];
    vm.getStaffByCompanyCalendar = getStaffByCompanyCalendar;
    vm.getServiceByCompanyCalendar = getServiceByCompanyCalendar;
    if(user.company._id){
      vm.getStaffByCompanyCalendar(user.company._id);
      vm.getServiceByCompanyCalendar(user.company._id);
    }

    function getStaffByCompanyCalendar(company_id) {
      var resource = StaffsByCompanyService.getStaffByCompany();
      resource.getStaffs({ companyIdStaff: company_id }).$promise.then(function(data) {
        for(var i = 0; i < data.length; i++){
          vm.listStaff.push(data[i]);
        }
        vm.currentStaff = vm.listStaff[0];
      });
    }

    function getServiceByCompanyCalendar(company_id) {
      var resource = AdminservicesByCompanyService.getServiceByCompany();
      vm.listService = resource.getAdminservices({ companyIdService: company_id });
    }

    function changeStaff() {
      console.log(vm.currentStaff);
    }


    function addStaff() {
      var _modal_create = ModalService.showModal({
        templateUrl: 'modules/staffs/client/views/form-create.client.view.html',
        controller: 'StaffsListController',
        controllerAs: 'vm'
      }).then(function(modal) {
        modal.element.modal();
      });
    }

    function addCustomer() {
      var _modal_create = ModalService.showModal({
        templateUrl: 'modules/customers/client/views/modal-form-customer.client.view.html',
        controller: 'CustomersListController',
        controllerAs: 'vm'
      }).then(function(modal) {
        modal.element.modal();
      });
    }

    function addService() {
      console.log(ModalService);
      var _modal_create = ModalService.showModal({
        templateUrl: 'modules/adminservices/client/views/modal-form-adminservice.client.view.html',
        controller: 'AdminservicesController',
        controllerAs: 'vm',
        inputs: {
          adminserviceResolve: new AdminservicesService()
        }
      }).then(function(modal) {
        modal.element.modal();
      });
    }

    $scope.uiConfig = {
      calendar: {
        height:  $(window).height()*0.83,
        defaultView: 'agendaWeek',
        columnFormat: 'dddd D/M',
        titleFormat: 'MMM D',
        axisFormat: 'h:mm A',
        timeFormat: 'h:mm T',
        header: {
          left: 'listYear,month,agendaWeek,agendaDay',
          center: '',
          right: 'title,prev,today,next'
        },
        schedulerLicenseKey: 'GPL-My-Project-Is-Open-Source',
        views: {
          agenda: {
            slotDuration: '00:10:00',
            allDaySlot: false,
            minTime: '08:00:00',
            maxTime: '18:00:00',
            snapDuration: '00:05:00',
            slotLabelInterval: '01:00:00'
          }
        },
        dayClick: vm.dayClick,
        eventClick: vm.eventClick,
        eventRender: vm.eventRender
      }
    };
    function dayClick (date, allDay, jsEvent, view) {
      console.log(date);
    }

    function eventClick (event) {
      console.log(event);
    }

    function eventRender (event, element) {
      // console.log(event);

      var _y = event.start._d.getUTCFullYear();
      var _m = (event.start._d.getUTCMonth() + 1) < 10 ? '0' + (event.start._d.getUTCMonth() + 1) : event.start._d.getUTCMonth() + 1;
      var _d = event.start._d.getUTCDate();
      var dateString = _y + '-' + _m + '-' + _d;
      $('td[data-date="' + dateString + '"]').addClass('fc-activeday');

      // console.log(event.start._d);
      // var _h = event.start._d.getUTCHours()<10?'0'+event.start._d.getUTCHours():event.start._d.getUTCHours();
      // var _mi = event.start._d.getUTCMinutes()<10?'0'+event.start._d.getUTCMinutes():event.start._d.getUTCMinutes();
      // var _s = event.start._d.getUTCSeconds()<10?'0'+event.start._d.getUTCSeconds():event.start._d.getUTCSeconds();
      // var _time = _h+':'+_mi+':'+_s;
      // console.log('td[data-time="' + _time + '"]');
      // $('tr[data-time="' + _time + '"]').addClass('fc-disable');

    }

    $scope.events = [
      {
        id: 1,
        title: 'Event 1',
        start: '2017-05-03T08:15:00',
        end: '2017-05-03T08:45:00',
        constraint: '1',
        editable: true,
        durationEditable: false,
        startEditable: true,
        description: 'This is a cool event 1',
        color: '#ff5487'
      },
      {
        id: 2,
        title: 'Event 2',
        start: '2017-05-04T10:15:00',
        end: '2017-05-04T10:45:00',
        constraint: '1',
        editable: true,
        durationEditable: false,
        startEditable: true,
        description: 'This is a cool event 2',
        color: '#54ff87'
      },
      {
        id: 3,
        title: 'Event 3',
        start: '2017-05-06T09:15:00',
        end: '2017-05-06T09:45:00',
        constraint: '1',
        editable: true,
        durationEditable: false,
        startEditable: true,
        description: 'This is a cool event 3',
        color: '#8754ff'
      }
    ];

    $scope.businessHour = [
      {
        id: 'working_hour',
        start: '08:00',
        end: '12:00',
        dow: [1, 2, 3, 4, 5, 6],
        rendering: 'background',
        className: 'holiday'
      },
      {
        id: 'breaking_hour',
        start: '13:00',
        end: '17:00',
        dow: [1, 2, 3, 4, 5, 6],
        rendering: 'background',
        className: 'holiday'
      }
    ];

    $scope.eventSources = [$scope.businessHour, $scope.events];
  }
}());
