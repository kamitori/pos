(function () {
  'use strict';

  // Companies controller
  angular
    .module('companies')
    .controller('CompaniesController', CompaniesController);

  CompaniesController.$inject = ['$scope', '$state', '$http', '$q', '$timeout', '$window', 'Authentication', 'companyResolve', 'Notification', 'StaffsService', 'StaffsByCompanyService', 'AdminservicesService', 'AdminservicesByCompanyService'];

  function CompaniesController ($scope, $state, $http, $q, $timeout, $window, Authentication, company, Notification, StaffsService, StaffsByCompanyService, AdminservicesService, AdminservicesByCompanyService) {
    var vm = this;

    vm.authentication = Authentication;
    vm.company = company;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.saveHour = saveHour;
    vm.close = close;
    vm.save = save;
    vm.step = 1;
    vm.created = 0;//mac dinh la 0
    vm.listStaff = [];
    vm.getStaffByCompany = getStaffByCompany;
    vm.currentStaff = new StaffsService();
    vm.newStaff = new StaffsService();
    vm.updateStaff = updateStaff;
    vm.addStaff = addStaff;
    vm.staffOfCompany = [];
    vm.deleteStaff = deleteStaff;
    vm.setListStaff = setListStaff;
    vm.selectedStaff = [];
    vm.settingStaffSelect = {
      scrollableHeight: '200px',
      scrollable: true,
      selectedToTop: true,
      enableSearch: true,
      template: '{{option.name}}'
    }
    vm.textStaffSelect = {
      // buttonDefaultText: 'Select staff',
      dynamicButtonTextSuffix: ''
    }
    vm.newService = new AdminservicesService();
    vm.currentService = new AdminservicesService();
    vm.newService.staffs = [];
    vm.createService = createService;
    vm.getServiceByCompany = getServiceByCompany;
    vm.addService = addService;
    vm.updateService = updateService;
    vm.deleteService = deleteService;
    vm.listService = [];
    vm.changeSelectStaff = {
      onSelectionChanged : function() {
        vm.updateService();
      }
    }

    vm.defer = $q.defer();
    if(user.company != null){
      vm.getStaffByCompany(user.company._id);
      vm.getServiceByCompany(user.company._id);
      vm.created = 1;
    }
    vm.workingHour = [
      {
        'start': '08:00',
        'end': '17:00',
        'active': false,
        'day': 'sunday',
        'dow': 1
      },
      {
        'start': '08:00',
        'end': '17:00',
        'active': true,
        'day': 'monday',
        'dow': 2
      },
      {
        'start': '08:00',
        'end': '17:00',
        'active': true,
        'day': 'tuesday',
        'dow': 3
      },
      {
        'start': '08:00',
        'end': '17:00',
        'active': true,
        'day': 'wednesday',
        'dow': 4
      },
      {
        'start': '08:00',
        'end': '17:00',
        'active': true,
        'day': 'thursday',
        'dow': 5
      },
      {
        'start': '08:00',
        'end': '17:00',
        'active': true,
        'day': 'friday',
        'dow': 6
      },
      {
        'start': '08:00',
        'end': '17:00',
        'active': true,
        'day': 'saturday',
        'dow': 7
      }
    ];

    vm.draw_list_working_hours = create_time(10);
    vm.change_working_hours = function (_index, _type) {
      // console.log(_index,_type);
      if (_type === undefined) {
        vm.workingHour[_index].start = document.getElementById('working_from_' + vm.workingHour[_index].day).value;
      } else {
        vm.workingHour[_index].end = document.getElementById('working_to_' + vm.workingHour[_index].day).value;
      }
    };
    vm.get_index_working_hours = function (_index, _val) {
      for (var i in vm.draw_list_working_hours) {
        if (vm.draw_list_working_hours[i]._id === _index) {
          return vm.draw_list_working_hours[i];
        }
      }
      if (_val === undefined) return vm.draw_list_working_hours[0];
      return vm.draw_list_working_hours[_val];
    };
    vm.list_day_of_week = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

    vm.update_workinghours = function (_index) {
      vm.workingHour[_index].start = document.getElementById('working_from_' + vm.workingHour[_index].day).value;
      vm.workingHour[_index].end = document.getElementById('working_to_' + vm.workingHour[_index].day).value;
    };

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
        _return.push(_one);
      }
      _return.splice((_return.length-1), 1);
      return _return;
    }

    vm.companyType = [
      'Hair Salon/Barbershop',
      'Nail Salon',
      'Spa/Massage/Waxing',
      'Computers/Technology/IT',
      'Consulting/Business Services',
      'Creative Services/Designer',
      'Developer',
      'Writer',
      'Law Office',
      'Tutor/Mentor/Instructor',
      'Educational Institution',
      'Government',
      'Enterprise',
      'Church/Religious Organization',
      'Medical/Clinic/Dentist',
      'Pet Services',
      'Photography',
      'Real Estate',
      'Restaurant/Cafe',
      'Shopping/Retail',
      'Sports/Recreational Activities',
      'Other',
    ]
    vm.changeStep = function(step){
      if(step == 1){
        vm.step = step;
      }else{
        if(vm.created == 1){
          vm.step = step;
        }else{
          Notification.error({ message: '<i class="glyphicon glyphicon-remove"></i>' + 'You do not set up your company yet' });
        }
      }
    };

    // Remove existing Company
    function remove() {
      if ($window.confirm('Are you sure you want to delete?')) {
        vm.company.$remove($state.go('companies.list'));
      }
    }

    // Save Company
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.companyForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.company._id) {
        vm.company.$update(successCallback, errorCallback);
        // console.log("update");
      } else {
        vm.company.$save(savesuccessCallback, errorCallback);
        // console.log("save");
      }

      function successCallback(res) {
        user.company = vm.company;
        vm.step++;
        vm.created = 1;
        vm.workingHour = vm.company.workingHour;
        vm.getStaffByCompany(vm.company._id);
      }

      function savesuccessCallback(res) {
        user.company = vm.company;
        vm.step++;
        vm.created = 1;
        vm.workingHour = vm.company.workingHour;
        var staff = new StaffsService();
        staff.name = user.first_name + ' ' + user.last_name;
        staff.email = user.email;
        staff.company = vm.company._id;
        staff.$save();
        vm.getStaffByCompany(vm.company._id);
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }

    //Save Bussiness hour
    function saveHour() {
      if (vm.company._id) {
        vm.company.$update(successCallback, errorCallback);
      }
      function successCallback(res) {
        vm.created = 1;
        vm.workingHour = vm.company.workingHour;
        user.company = vm.company;
        vm.step++;
      }
      function errorCallback(res) {
        Notification.error({ message: '<i class="glyphicon glyphicon-remove"></i>' + res.data.message });
      }
    }

    //Get ListStaffByCompany
    function getStaffByCompany(company_id) {
      var resource = StaffsByCompanyService.getStaffByCompany();
      // setTimeout(function () {
      vm.listStaff = resource.getStaffs({ companyIdStaff: company_id });
      vm.setListStaff();
        // console.log(vm.currentStaff);
      // }, 1000);
      
      // vm.currentStaff = vm.listStaff.0;
      
    }

    //Set List Staff for Service
    function setListStaff(){
      vm.listStaff.$promise.then(function(data) {
        $timeout(function() {
          var arr_tmp = [];
          for(var i = 0; i < data.length; i++) {
            data[i].id = data[i]._id;
            arr_tmp.push(data[i]);
          }
          vm.staffOfCompany = vm.staffOfCompany.concat(arr_tmp);
          vm.newService.staffs = vm.staffOfCompany.concat([]);
        });
      })
    }

    // Update Staff
    function updateStaff(){
      var check = true;
      var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      // console.log(vm.currentStaff);
      if(check && vm.currentStaff.name == ''){
        Notification.error({ message: '<i class="glyphicon glyphicon-remove"></i> Name of staff is empty!' });
        check = false;
      }
      if(check && vm.currentStaff.email == ''){
        Notification.error({ message: '<i class="glyphicon glyphicon-remove"></i> Email of staff is empty!' });
        check = false;
      }
      if(check && !re.test(vm.currentStaff.email)){
        Notification.error({ message: '<i class="glyphicon glyphicon-remove"></i> Email of staff is not correct!' });
        check = false;
      }
      if(check){
        vm.newStaff.company = vm.company._id;
        vm.newStaff.workinghours = vm.company.workingHour;
        vm.newStaff.time_break = vm.company.breakingHour;
        vm.currentStaff.$update(function(res) {
          Notification.success({ message: '<i class="glyphicon glyphicon-ok"></i>' + 'Update staff success!' });
        }, function(res) {
          Notification.error({ message: '<i class="glyphicon glyphicon-remove"></i>' + res.data.message });
        });
      }
    }

    // Add Staff
    function addStaff(){
      var check = true;
      var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      // console.log(vm.currentStaff);
      if(check && vm.newStaff.name == ''){
        Notification.error({ message: '<i class="glyphicon glyphicon-remove"></i> Name of staff is empty!' });
        check = false;
      }
      if(check && vm.newStaff.email == ''){
        Notification.error({ message: '<i class="glyphicon glyphicon-remove"></i> Email of staff is empty!' });
        check = false;
      }
      if(check && !re.test(vm.newStaff.email)){
        Notification.error({ message: '<i class="glyphicon glyphicon-remove"></i> Email of staff is not correct!' });
        check = false;
      }
      if(check){
        vm.newStaff.company = vm.company._id;
        vm.newStaff.workinghours = vm.company.workingHour;
        vm.newStaff.time_break = vm.company.breakingHour;
        vm.newStaff.$save(function(res) {
          vm.getStaffByCompany(vm.company._id);
          Notification.success({ message: '<i class="glyphicon glyphicon-ok"></i>' + 'Create staff success!' });
          vm.newStaff = new StaffsService();
        }, function(res) {
          Notification.error({ message: '<i class="glyphicon glyphicon-remove"></i>' + res.data.message });
        });
      }
    }

    // Delete Staff
    function deleteStaff(){
      if ($window.confirm('Are you sure you want to delete?')) {
        vm.currentStaff.$removeStaff(function(res) {
          vm.getStaffByCompany(vm.company._id);
          Notification.success({ message: '<i class="glyphicon glyphicon-ok"></i>' + 'Delete staff success!' });
        });
      }
    }

    // create service
    function createService(){
      vm.newService = new AdminservicesService();
      vm.newService.staffs = vm.staffOfCompany;
      vm.newService.company = vm.company._id;
    }

    // save service
    function addService(){
      vm.newService.company = vm.company._id;

      // TODO: move create/update logic to service
      vm.newService.$save(successCallback, errorCallback);

      function successCallback(res) {
        Notification.success({ message: '<i class="glyphicon glyphicon-ok"></i>' + 'Create staff success!' });
        vm.getServiceByCompany(vm.company._id);
        vm.createService();
      }

      function errorCallback(res) {
        Notification.error({ message: '<i class="glyphicon glyphicon-remove"></i>' + res.data.message });
      }
    }


    //Get List Service
    function getServiceByCompany(company_id){
      var resource = AdminservicesByCompanyService.getServiceByCompany();
      vm.listService = resource.getAdminservices({ companyIdService: company_id });
      // console.log(vm.listService);
    }

    // Update Staff
    function updateService(){
      var check = true;
      // var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      // console.log(vm.currentStaff);
      if(check && vm.currentService.name == ''){
        Notification.error({ message: '<i class="glyphicon glyphicon-remove"></i> Name of service is empty!' });
        check = false;
      }
      if(check){
        vm.currentService.$update(function(res) {
          Notification.success({ message: '<i class="glyphicon glyphicon-ok"></i>' + 'Update service success!' });
        }, function(res) {
          Notification.error({ message: '<i class="glyphicon glyphicon-remove"></i>' + res.data.message });
        });
      }
    }

    // Delete Service
    function deleteService(){
      if ($window.confirm('Are you sure you want to delete?')) {
        vm.currentService.$removeService(function(res) {
          vm.getServiceByCompany(vm.company._id);
          Notification.success({ message: '<i class="glyphicon glyphicon-ok"></i>' + 'Delete Service success!' });
        });
      }
    }

  }
}());
