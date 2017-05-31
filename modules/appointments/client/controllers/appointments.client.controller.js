(function () {
  'use strict';

  // Appointments controller
  angular
    .module('appointments')
    .controller('AppointmentsController', AppointmentsController);

  AppointmentsController.$inject = ['$scope', '$state', '$window', 'close', 'Authentication', 'Notification', 'appointmentResolve', 'customerResolve', 'AdminservicesByCompanyService', 'AppointmentsService'];

  function AppointmentsController ($scope, $state, $window, close, Authentication, Notification, appointment, customer, AdminservicesByCompanyService, AppointmentsService) {
    var vm = this;

    vm.authentication = Authentication;
    vm.appointment = appointment;
    vm.appointment.customer = customer;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;
    vm.listService = [];
    vm.getServiceByCompany = getServiceByCompany;
    vm.changeService = changeService;
    if(user.company != null){
      vm.getServiceByCompany(user.company._id);
      vm.appointment.company = user.company._id;
    }
    vm.listStaff = [];
    // console.log("vm.appointment.datetime: ", vm.appointment.datetime);
    
    if(vm.appointment.datetime){
      vm.appointment.datetime = new Date(vm.appointment.datetime);
      var h = vm.appointment.datetime.getHours()<10?'0'+vm.appointment.datetime.getHours():vm.appointment.datetime.getHours();
      var m = vm.appointment.datetime.getMinutes()<10?'0'+vm.appointment.datetime.getMinutes():vm.appointment.datetime.getMinutes();
      vm.appointment.time = {
            '_id': (h + ':' + m),
          };
    }else{
      vm.appointment.datetime = new Date();
      vm.appointment.time = null;
    }

    // console.log("vm.appointment.datetime: ", vm.appointment.datetime);

    vm.formatDate = 'EEE, MMM dd';
    vm.openDate = false;
    vm.minDate = new Date();
    vm.maxDate = new Date();
    vm.maxDate.setMonth(vm.maxDate.getMonth()+3); // Cho phép đặt trước 3 tháng
    
    vm.dateOptions = { dateDisabled: vm.disabled, maxDate: vm.maxDate, minDate: vm.minDate };
    // Disable weekend selection
    vm.disabled = function(data) {
      var date = data.date,
        mode = data.mode;
      var arr_check = [];
      for(var i = 0; i < vm.appointment.staff.workinghours.length; i++){
        var wk = vm.appointment.staff.workinghours[i];
        if(wk.active === false) {
          arr_check.push(i);
        }
      }
      return mode === 'day' && (arr_check.indexOf(date.getDay()) >= 0);
    }
    vm.setupTime = setupTime;
    function create_time(_per_minite) {
      var _return = [];
      var _start = 96;
      var _end = 252;
      if (_per_minite === undefined) {
        _per_minite = 5;
      } else {
        var _per = 60 / _per_minite;
        var _all = 24 * _per;
        _start = _per * 0;
        _end = _all;
      }
      _per_minite = parseInt(_per_minite, 10);

      // for (var i = _start; i <= _end; i++) {
      //   var _minute = i * _per_minite;
      //   var _hour = parseInt(_minute / 60, 10);
      //   _minute = _hour * 60 - _minute;
      //   var _r_hour = _hour;
      //   var _pm = 'pm';
      //   if (_minute < 0) _minute *= -1;
      //   if (_hour >= 12) {
      //     if(_hour > 12){
      //       _hour -= 12;
      //     }
      //   } else {
      //     _pm = 'am';
      //   }
      //   if (_minute < 10) _minute = '0' + _minute;
      //   if (_r_hour < 10) _r_hour = '0' + _r_hour;
      //   if (_hour < 10) _hour = '0' + _hour;
      //   var _one = {
      //     '_id': (_r_hour + ':' + _minute),
      //     '_val': (_hour + ':' + _minute + ' ' + _pm)
      //   };
      //   _return.push(_one);
      // }
      // _return.splice((_return.length-1), 1);

      var _app_date;
      var arr_obj_time_work = [];
      var arr_obj_time_break = [];
      var _app_date;
      _app_date = vm.appointment.datetime;
      var _app_dow = _app_date.getDay()+1;

      if(vm.appointment.staff.workinghours.length) {
        for(var i = 0; i < vm.appointment.staff.workinghours.length; i++) {
          if(vm.appointment.staff.workinghours[i].dow == _app_dow) {
            var time_work = vm.appointment.staff.workinghours[i];
            var obj_time_work = {
              h_start: parseInt(time_work.start.split(':')[0]),
              m_start: parseInt(time_work.start.split(':')[1]),
              h_end: parseInt(time_work.end.split(':')[0]),
              m_end: parseInt(time_work.end.split(':')[1])
            };
            arr_obj_time_work.push(obj_time_work);
          }
        }
      }

      if(vm.appointment.staff.time_break.length) {
        for(var i = 0; i < vm.appointment.staff.time_break.length; i++) {
          if(vm.appointment.staff.time_break[i].dow == _app_dow) {
            var time_break = vm.appointment.staff.time_break[i];
            var obj_time_break = {
              h_start: parseInt(time_break.start.split(':')[0]),
              m_start: parseInt(time_break.start.split(':')[1]),
              h_end: parseInt(time_break.end.split(':')[0]),
              m_end: parseInt(time_break.end.split(':')[1])
            };
            arr_obj_time_break.push(obj_time_break);
          }
        }
      }

      var _work = [];
      var _break = [];
      for(var i = 0; i < arr_obj_time_work.length; i++) {
        var obj_work = arr_obj_time_work[i];
        _start = _per * (obj_work.h_start) + (obj_work.m_start/_per_minite);
        _end = _per * (obj_work.h_end) + (obj_work.m_end/_per_minite) - (vm.appointment.sduration/_per_minite);
        for (var i = _start; i <= _end; i++) {
          var _minute = i * _per_minite;
          var _hour = parseInt(_minute / 60, 10);
          _minute = _hour * 60 - _minute;
          var _r_hour = _hour;
          var _pm = 'pm';
          if (_minute < 0) _minute *= -1;
          if (_hour >= 12) {
            if(_hour > 12){
              _hour -= 12;
            }
          } else {
            _pm = 'am';
          }
          if (_minute < 10) _minute = '0' + _minute;
          if (_r_hour < 10) _r_hour = '0' + _r_hour;
          if (_hour < 10) _hour = '0' + _hour;
          var _one = {
            '_id': (_r_hour + ':' + _minute),
            '_val': (_hour + ':' + _minute + ' ' + _pm)
          };
          _work.push(_one);
        }
      }

      for(var i = 0; i < arr_obj_time_break.length; i++) {
        var obj_break = arr_obj_time_break[i];
        _start = _per * (obj_break.h_start) + (obj_break.m_start/_per_minite) - (vm.appointment.sduration/_per_minite);
        _end = _per * (obj_break.h_end) + (obj_break.m_end/_per_minite) ;
        for (var i = _start; i <= _end; i++) {
          var _minute = i * _per_minite;
          var _hour = parseInt(_minute / 60, 10);
          _minute = _hour * 60 - _minute;
          var _r_hour = _hour;
          var _pm = 'pm';
          if (_minute < 0) _minute *= -1;
          if (_hour >= 12) {
            if(_hour > 12){
              _hour -= 12;
            }
          } else {
            _pm = 'am';
          }
          if (_minute < 10) _minute = '0' + _minute;
          if (_r_hour < 10) _r_hour = '0' + _r_hour;
          if (_hour < 10) _hour = '0' + _hour;
          var _one = {
            '_id': (_r_hour + ':' + _minute),
            '_val': (_hour + ':' + _minute + ' ' + _pm)
          };
          _break.push(_one);
        }
        _break.splice(0,1);
        _break.splice(_break.length - 1,1);
      }

      var arr_check = [];
      var i_deleted = 0;
      for(var i = 0; i < _work.length; i++) {
        for(var j = 0; j < _break.length; j++) {
          if(_break[j]._id === _work[i]._id){
            arr_check.push(i);
          }
        }
      }

      for(var i = 0; i < arr_check.length; i++){
        _work.splice(arr_check[i]-i_deleted,1);
        i_deleted++;
      }

      return _work;
    }

    function setupTime() {
      vm.draw_list_working_hours = create_time(5);
      if(vm.appointment.time == null){
        vm.appointment.time = vm.draw_list_working_hours[0];
      }
    }

    vm.applyTime = applyTime;

    function applyTime(){
      // console.log(vm.appointment);
      var hour = parseInt(vm.appointment.time._id.split(':')[0]);
      var minute = parseInt(vm.appointment.time._id.split(':')[1]);
      var second = 0;
      vm.appointment.datetime.setHours(hour);
      vm.appointment.datetime.setMinutes(minute);
      vm.appointment.datetime.setSeconds(second);
      // console.log(vm.appointment);
    }
  
    //Get List Service
    function getServiceByCompany(company_id) {
      var resource = AdminservicesByCompanyService.getServiceByCompany();
      vm.listService = resource.getAdminservices({ companyIdService: company_id });
      vm.listService.$promise.then(function(data) {
        if(!vm.appointment.service){
          vm.appointment.service = data[0];
          vm.listStaff = vm.appointment.service.staffs;
          vm.appointment.staff = vm.listStaff[0];
          vm.appointment.sprice = vm.appointment.service.sprice;
          vm.appointment.sduration = vm.appointment.service.sduration;
          vm.setupTime();
          vm.applyTime();
        }else{
          for(var i = 0; i < data.length; i++) {
            if(vm.appointment.service == data._id) {
              vm.appointment.service = data[i];
            }
          }
          vm.listStaff = vm.appointment.service.staffs;
          for(var i = 0; i < vm.listStaff.length; i++) {
            if(vm.appointment.staff == vm.listStaff[i]._id){
              vm.appointment.staff = vm.listStaff[i];
            }
          }
          vm.appointment.sprice = vm.appointment.service.sprice;
          vm.appointment.sduration = vm.appointment.service.sduration;
          vm.setupTime();
          vm.applyTime();
        }
      })
    }

    // Change service
    function changeService() {
      vm.appointment.sprice = vm.appointment.service.sprice;
      vm.appointment.sduration = vm.appointment.service.sduration;
      vm.listStaff = vm.appointment.service.staffs;
      vm.appointment.staff = vm.listStaff[0];
      console.log(vm.appointment);
    }

    // Remove existing Appointment
    function remove() {
      if ($window.confirm('Are you sure you want to delete?')) {
        vm.appointment.$remove();
      }
    }

    // Save Appointment
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.appointmentForm');
        return false;
      }
      vm.appointment.staffname = vm.appointment.staff.name;
      vm.appointment.servicename = vm.appointment.service.name;

      // TODO: move create/update logic to service
      if (vm.appointment._id) {
        vm.appointment.$update(successCallback, errorCallback);
      } else {
        vm.appointment.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        angular.element('#modalAppointment').modal('hide');
        // vm.getServiceByCompany(user.company._id);
        if (vm.appointment._id) {
          Notification.success({ message: '<i class="glyphicon glyphicon-ok"></i>' + 'Update appointment success!' });
        } else {
          Notification.success({ message: '<i class="glyphicon glyphicon-ok"></i>' + 'Add appointment success!' });
        }
      }

      function errorCallback(res) {
        // vm.getServiceByCompany(user.company._id);
        Notification.error({ message: '<i class="glyphicon glyphicon-remove"></i>' + res.data.message });
      }
    }


    // console.log(vm.appointment);
  }
}());
