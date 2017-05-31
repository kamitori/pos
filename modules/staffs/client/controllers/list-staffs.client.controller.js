var first = false;

(function () {
  'use strict';
  var app = angular
    .module('staffs')
    .controller('StaffsListController', StaffsListController)
    .controller('StaffsEditController', StaffsEditController);

  StaffsListController.$inject = ['StaffsService', '$scope', '$window', '$state', '$location', 'ModalService', '$http', 'Notification'];

  function StaffsListController(StaffsService, $scope, $window, $state, $location, ModalService, $http, Notification) {
    var vm = this;
    vm.title = 'SETTINGS';
    $scope.first_change = true;
    vm.first_change_password = function () {
      vm.first_change != vm.first_change;
    };
    $scope.quicksave = function() {
      var _staff_name = document.getElementById('staff_name').value;
      var _staff_email = document.getElementById('staff_email').value;
      var _staff_ex = document.getElementById('staff_password').value;
      var first_login = $scope.first_change;
      $http({
        method: 'POST',
        url: '/api/staffs/quicksave/quickadd',
        data: {
          'name': _staff_name,
          'email': _staff_email,
          'password': _staff_ex,
          'first_login': first_login
        },
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
      }).success(function(data, status, headers, config) {
        Notification.success({ message: '<i class="glyphicon glyphicon-ok"></i> Create new staff successful!' });
        $state.reload();
      }).error(function(data, status, headers, config) {
      });
    };
    vm.staff_name = '';
    vm.staff_email = '';
    vm.staff_ex = '';
    vm.topnav = true;
    vm.staffs = StaffsService.query();
    vm.currentPage = 0;
    vm.pageSize = 8;
    vm.first = false;
    vm.q = '';
    vm.test = function () {
      if (!vm.first) {
        vm.showModal();
        vm.closeModal();
        vm.first = true;
      }
    };
    vm.closeModal = function() {
      close(1);
    };
    vm.showModal = function () {
      ModalService.showModal({
        templateUrl: 'modules/staffs/client/views/form-create.client.view.html',
        controller: 'StaffsListController'
      }).then(function(modal) {
        modal.element.modal();
        first = true;
        modal.close.then(function(result) {
        });
      });
    };
    vm.numberOfPages = function () {
      return Math.ceil(vm.staffs.length / vm.pageSize);
    };

    // tab
    $scope.tab = 1;
    var _current_path = $location.path();
    var _current = _current_path.split('/');
    if (_current.length > 4) {
      _current = _current.slice(-1)[0];
      if (_current === 'details') $scope.tab = 1;
      else if (_current === 'service') $scope.tab = 2;
      else if (_current === 'workinghours') $scope.tab = 3;
      else if (_current === 'breaks') $scope.tab = 4;
      else $scope.tab = 5;
    }
    $scope.setTab = function(newTab) {
      if (newTab === 'timeoff') newTab = 5;
      else if (newTab === 'breaks') newTab = 4;
      else if (newTab === 'workinghours') newTab = 3;
      else if (newTab === 'service') newTab = 2;
      else newTab = 1;
      $scope.tab = newTab;
    };
    $scope.isSet = function(tabNum) {
      if (tabNum === 'timeoff') tabNum = 5;
      else if (tabNum === 'breaks') tabNum = 4;
      else if (tabNum === 'workinghours') tabNum = 3;
      else if (tabNum === 'service') tabNum = 2;
      else tabNum = 1;
      return $scope.tab === tabNum;
    };
  }

  StaffsEditController.$inject = ['$scope', '$state', '$window', 'Authentication', 'AdminservicesService', 'TbworkinghoursService', 'staffResolve', 'Upload', '$http', 'Notification', '$location'];
  function StaffsEditController($scope, $state, $window, Authentication, AdminservicesService, TbworkinghoursService, staff, Upload, $http, Notification, $location) {
    var vm = this;

    vm.listService = AdminservicesService.query();    
    vm.authentication = Authentication;
    vm.staff = staff;
    vm.current_month = new Date().getMonthName();
    vm.total_working_hours = 0;
    vm.display_start_date = '';
    vm.display_end_date = '';
    vm.current_week = function () {
      var _date = new Date().getDate();
      _date = Math.ceil(_date / 7);
      return _date > 4 ? 4 : _date;
    };
    vm.set_total_working_hours = function () {      
      return parseFloat((vm.total_working_hours / 2).toFixed(2));
    };
    vm.plus7days = function () {
      var _current = new Date(vm.display_start_date);            
      var _month = _current.getMonth() + 1;      
      var _day = _current.getDate() + 7;
      var _year = _current.getFullYear();

      var _max_day = daysInMonth(_month, _year);
      if (_day > _max_day) {
        _month = _month + 1;
        if (_month > 12) {
          _month = _month - 12;
          _year = _year + 1;
        }
        _day = _day - _max_day;
      }
      _month = _month < 12 ? ('0' + _month): _month;
      var _lastWeek =  _year + '-' + _month + '-' + _day;
      angular.element('#timeoff_from').val(_lastWeek);
      angular.element('#timeoff_from').triggerHandler('change');
    };
    vm.minus7days = function () {
      var _current = new Date(vm.display_start_date);            
      var _month = _current.getMonth() + 1;      
      var _day = _current.getDate() - 7;
      var _year = _current.getFullYear();
      if (_day <0) {
        _month = _month - 1;
        if(_month == 0){
          _year = _year - 1;
          _month = 12;
        }
        var _max_day = daysInMonth(_month, _year);
        _day = _max_day + _day;
      }
      _month = _month < 12 ? ('0' + _month): _month;
      var _lastWeek =  _year + '-' + _month + '-' + _day;
      angular.element('#timeoff_from').val(_lastWeek);
      angular.element('#timeoff_from').triggerHandler('change');
    };
    vm.triggerdateclick = function () {
      angular.element('#timeoff_from').triggerHandler('click');
    };
    vm.change_data = function () {
      var _val = angular.element('#timeoff_from').val();
      $http({
        method: 'POST',
        url: '/api/staffs/getworkinghoursdata',
        data: {
          'id': vm.staff._id,
          '_date': _val
        },
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
      }).success(function(data, status, headers, config) {
        vm.total_working_hours = 0;
        if (data.length > 0) vm.has_working_data = true;
        var _date = new Date(_val);
        var _day_date = _date.getDate();
        var _day = parseInt(_date.getDay(), 10);
        if (_day >= 7) _day = _day % 7;
        if (_day == 0) {
          vm.start_day = _day_date - 6;
          vm.end_day = _day_date;          
        } else if (_day == 1) {
          vm.start_day = _day_date;
          vm.end_day = _day_date + 6;
        }else if (_day == 2) {
          vm.start_day = _day_date - 1;
          vm.end_day = _day_date + 5;
        }else if (_day == 3) {
          vm.start_day = _day_date - 2;
          vm.end_day = _day_date + 4;
        }else if (_day == 4) {
          vm.start_day = _day_date - 3;
          vm.end_day = _day_date + 3;
        }else if (_day == 5) {
          vm.start_day = _day_date - 4;
          vm.end_day = _day_date + 2;
        }else {          
          vm.start_day = _day_date - 5;
          vm.end_day = _day_date + 1;
        }
        var _arr = _val.split('-');
        var _max_day = daysInMonth(_arr[1], _arr[0]);
        if (vm.end_day > _max_day) vm.end_day = _max_day;
        vm.current_month = _date.getMonthName();

        vm.current_week = Math.ceil(_day_date / 7) > 4 ? 4 : Math.ceil(_day_date / 7);
        vm.list_working_hours_data = data;
      }).error(function(data, status, headers, config) {
        Notification.error({ message: '<i class="glyphicon glyphicon-ok"></i> Error on getting data' });
      });
    };
    vm.start_day = 1;
    vm.end_day = 30;
    vm.list_working_hours_data = {};
    vm.has_working_data = false;
    vm.convert_number_to_month = {
      '01': 'Jan',
      '02': 'Feb',
      '03': 'Mar',
      '04': 'April',
      '05': 'May',
      '06': 'Jun',
      '07': 'July',
      '08': 'Aug',
      '09': 'Sep',
      '10': 'Oct',
      '11': 'Nov',
      '12': 'Dec',
      1: 'Jan',
      2: 'Feb',
      3: 'Mar',
      4: 'April',
      5: 'May',
      6: 'Jun',
      7: 'July',
      8: 'Aug',
      9: 'Sep',
      10: 'Oct',
      11: 'Nov',
      12: 'Dec'
    };
    vm.getNextDate = function (_date, _next) {      
      var _new_date = new Date((new Date(_date)).valueOf() + 1000 * 3600 * 24 * _next);
      return _new_date.getDate() + ' ' + vm.convert_number_to_month[(_new_date.getMonth() + 1)] + ' '+ _new_date.getFullYear() ;
    };
    vm.list_day_of_weeks = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    vm.getYear = function (date) {
      date = date.toString();
      return date.substring(0, 4);
    };    
    vm.convert_24_hours_to_12_hours = function (_time) {
      if (_time =='' || _time === undefined) return '';
      _time = _time.toString();      
      var _arr = _time.split(':');
      var _hours = _arr[0];
      var _currency = 'AM';
      if (_hours >= 12) {
        _currency = 'PM';
        _hours -= 12;
      }
      return _hours + ':' + _arr[1] + ' ' + _currency;
    };
    vm.count_working_hours = function (_start, _end, _lunch) {
      var _start_hour = 0;
      var _start_minute = 0;
      var _end_hour = 0;
      var _end_minute = 0;
      _lunch = parseInt(_lunch, 10);
      if (_start) {
        var _arr_start = _start.split(':');
        _start_hour = _arr_start[0];
        _start_minute = _arr_start[1];
      }
      if (_end) {
        var _arr_end = _end.split(':');
        _end_hour = _arr_end[0];
        _end_minute = _arr_end[1];
      }
      var _working_hour = _end_hour - _start_hour;
      var _working_minute = _end_minute - _start_minute;
      if (_working_minute < 0) {
        _working_hour -= 1;
        _working_minute += 60;
      }
      _working_minute = _working_minute / 60;
      _working_minute = parseFloat(_working_minute.toFixed(2));
      var _total = parseFloat((_working_hour + _working_minute - _lunch).toFixed(2));
      if (_total < 0) _total = 0;      
      return _total;
    };
    vm.convertToDayOfWeek = function (_date, minus_day) {
      var _new_date = new Date(_date);
      var _day = parseInt(_new_date.getDay(), 10);
      if (_day >= 7) _day = _day % 7;
      return _day;
    };
    vm.getDayStart = function (date) {      
      var date = date.slice(0, 10).split('-'); 
      return date[2] + ' ' + vm.convert_number_to_month[date[1]] + ' ' + date[0];
    };
    vm.getMonth = function (date) {
      date = date.toString();
      return date.substring(4, 6);
    };
    vm.range = function(min, max, step) {
        step = step || 1;
        var input = [];
        for (var i = min; i <= max; i += step) {
            input.push(i);
        }
        return input;
    };
    $http({
      method: 'POST',
      url: '/api/staffs/getworkinghoursdata',
      data: {
        'id': vm.staff._id
      },
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    }).success(function(data, status, headers, config) {
      if (data.length > 0) vm.has_working_data = true;
      var _date = new Date();
      var _day_date = _date.getDate();
      var _day = parseInt(_date.getDay(), 10);
      if (_day >= 7) _day = _day % 7;
      if (_day == 0) {
        vm.start_day = _day_date - 6;
        vm.end_day = _day_date;          
      } else if (_day == 1) {
        vm.start_day = _day_date;
        vm.end_day = _day_date + 6;
      }else if (_day == 2) {
        vm.start_day = _day_date - 1;
        vm.end_day = _day_date + 5;
      }else if (_day == 3) {
        vm.start_day = _day_date - 2;
        vm.end_day = _day_date + 4;
      }else if (_day == 4) {
        vm.start_day = _day_date - 3;
        vm.end_day = _day_date + 3;
      }else if (_day == 5) {
        vm.start_day = _day_date - 4;
        vm.end_day = _day_date + 2;
      }else {          
        vm.start_day = _day_date - 5;
        vm.end_day = _day_date + 1;
      }
      var _max_day = daysInMonth(_date.getMonth() + 1, _date.getFullYear());
      if (vm.end_day > _max_day) vm.end_day = _max_day;
      vm.list_working_hours_data = data;
    }).error(function(data, status, headers, config) {
      Notification.error({ message: '<i class="glyphicon glyphicon-ok"></i> Error on getting data' });
    });
    vm.current_week = vm.current_week();
    vm.current_url = $location.absUrl();
    vm.show_all = vm.checf_cook = vm.dish_washer = false;
    if (vm.staff.services && vm.staff.services.service && vm.staff.services.service.length > 0) vm.show_all = true;
    if (vm.staff.services && vm.staff.services.checf_cook && vm.staff.services.checf_cook.length > 0) vm.checf_cook = true;
    if (vm.staff.services && vm.staff.services.dish_washer && vm.staff.services.dish_washer.length > 0) vm.dish_washer = true;
    if (vm.staff.services && vm.staff.services.service) vm.list_service = vm.staff.services.service;
    else vm.list_service = {};
    if (vm.staff.services && vm.staff.services.checf_cook) vm.list_checf_cook = vm.staff.services.checf_cook;
    else vm.list_checf_cook = {};
    if (vm.staff.services && vm.staff.services.dish_washer) vm.list_dish_washer = vm.staff.services.dish_washer;
    else vm.list_dish_washer = {};
    vm.draw_list_working_hours = _draw_working_hours_interval_5_minus();
    vm.draw_list_working_hours_30_minus = _draw_working_hours_interval_5_minus(30);
    vm.change_working_hours = function (_index, _type) {
      if (_type === undefined) {
        vm.staff.workinghours[_index].from_time = document.getElementById('working_from_' + vm.staff.workinghours[_index].day).value;
      } else {
        vm.staff.workinghours[_index].to_time = document.getElementById('working_to_' + vm.staff.workinghours[_index].day).value;
      }
    };
    vm.get_index_working_hours = function (_index, _val) {
      for (var i in vm.draw_list_working_hours_30_minus) {
        if (vm.draw_list_working_hours_30_minus[i]._id === _index) {
          return vm.draw_list_working_hours_30_minus[i];
        }
      }
      if (_val === undefined) return vm.draw_list_working_hours_30_minus[0];
      return vm.draw_list_working_hours_30_minus[_val];
    };
    vm.list_day_of_week = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
    if (vm.staff.workinghours === undefined || vm.staff.workinghours === '') {
      vm.staff.workinghours = [];
    }
    if (vm.staff.workinghours.length <= 0) {
      for (var i in vm.list_day_of_week) {
        if (vm.list_day_of_week.hasOwnProperty(i)) {
          var _one = {
            'day': vm.list_day_of_week[i],
            'active': false,
            'from_time': '8:00am',
            'to_time': '5:00am'
          };
          vm.staff.workinghours.push(_one);
        }
      }
    }
    vm.update_workinghours = function (_index) {
      vm.staff.workinghours[_index].from_time = document.getElementById('working_from_' + vm.staff.workinghours[_index].day).value;
      vm.staff.workinghours[_index].to_time = document.getElementById('working_to_' + vm.staff.workinghours[_index].day).value;
    };
    vm.add_break = function (_day) {
      if (vm.staff.time_break === undefined) vm.staff.time_break = [];
      var _one = {
        'day': _day,
        'from_time': document.getElementById('from_' + _day).value,
        'to_time': document.getElementById('to_' + _day).value
      };
      vm.staff.time_break.push(_one);
    };
    vm.add_off = function () {      
      if (vm.staff.time_off === undefined) vm.staff.time_off = [];
      var _one = {
        'from_date': document.getElementById('timeoff_from').value,
        'to_date': document.getElementById('timeoff_to').value,
        'noted': document.getElementById('timeoff_note').value,
      };
      vm.staff.time_off.push(_one);
    };
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;
    vm.clickservice = function (_key, _all) {
      _change_status(_key);
      if (_all) {
        if (_all === 1) vm.show_all = !vm.show_all;
        else if (_all === 2) vm.checf_cook = !vm.checf_cook;
        else vm.dish_washer = !vm.dish_washer;
      }
      var _elements = document.getElementsByClassName('glyphicon-minus-sign');
      var _temp = {};
      var _dish_washer = [];
      var _checf_cook = [];
      for (var i in _elements) {
        if (_elements.hasOwnProperty(i)) {
          var _element = _elements[i];
          var _current_id = _element.id;
          if ((' ' + _element.className + ' ').indexOf(' ' + 'checf_cook' + ' ') > -1) {
            _current_id = _current_id.replace('checf_cook_', '');
            if ((' ' + _checf_cook + ' ').indexOf(_current_id) <= -1) {
              _checf_cook.push(_current_id);
            }
          } else if ((' ' + _element.className + ' ').indexOf(' ' + 'dish_washer' + ' ') > -1) {
            _current_id = _current_id.replace('dish_washer_', '');
            if ((' ' + _dish_washer + ' ').indexOf(_current_id) <= -1) {
              _dish_washer.push(_current_id);
            }
          }
        }
      }
      _temp.checf_cook = _checf_cook;
      _temp.dish_washer = _dish_washer;
      vm.staff.services = _temp;
    };
    // tab
    $scope.tab = 1;
    var _current_path = $location.path();
    var _current = _current_path.split('/');
    if (_current.length > 4) {
      _current = _current.slice(-1)[0];
      if (_current === 'details') $scope.tab = 1;
      else if (_current === 'service') $scope.tab = 2;
      else if (_current === 'workinghours') $scope.tab = 3;
      else if (_current === 'breaks') $scope.tab = 4;
      else $scope.tab = 5;
    }
    $scope.setTab = function(newTab) {
      if (newTab === 'timeoff') newTab = 5;
      else if (newTab === 'breaks') newTab = 4;
      else if (newTab === 'workinghours') newTab = 3;
      else if (newTab === 'service') newTab = 2;
      else newTab = 1;
      $scope.tab = newTab;
    };
    $scope.isSet = function(tabNum) {
      if (tabNum === 'timeoff') tabNum = 5;
      else if (tabNum === 'breaks') tabNum = 4;
      else if (tabNum === 'workinghours') tabNum = 3;
      else if (tabNum === 'service') tabNum = 2;
      else tabNum = 1;
      return $scope.tab === tabNum;
    };
    // Remove existing Staff
    function remove() {
      if ($window.confirm('Are you sure you want to delete?')) {
        Notification.success({ message: '<i class="glyphicon glyphicon-ok"></i> Delete staff successful!' });
        var _element = document.getElementById(vm.staff._id);
        _element.remove();
        vm.staff.$remove();
        $state.go('staffs.list');
        _click_first_item(1);
      }
    }

    // Save Staff
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.staffForm');
        return false;
      }
      try {
        $scope.$watch('file', function() {
          $scope.upload = Upload.upload({
            url: '/api/staffs/saveimage',
            method: 'POST',
            headers: { 'Content-Type': 'multipart/form-data' },
            file: $scope.file
          }).success(function (response, status) {
            var d = new Date();
            var datetimestamp = d.getMonth() + '-' + d.getDate() + '-' + d.getFullYear();
            if ($scope.file && $scope.file.name) {
              var old_name = $scope.file.name;
              var new_name = old_name.split('.')[0] + '-' + datetimestamp + '.' + old_name.split('.')[old_name.split('.').length - 1];
              vm.staff.photo = '/img/staffs/' + new_name;
              document.getElementById('img' + vm.staff._id).src = vm.staff.photo;
            }
            if (vm.staff._id) {
              vm.staff.$update(successCallback, errorCallback);
            } else {
              vm.staff.$save(successCallback, errorCallback);
            }
          }).error(function (errorResponse) {

          });
        });
      } catch (ex) {
      }

      function successCallback(res) {
        Notification.success({ message: '<i class="glyphicon glyphicon-ok"></i> Update staff successful!' });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
        Notification.error({ message: '<i class="glyphicon glyphicon-ok"></i> ' + vm.error + '!' });
      }
    }
  }

  app.directive('onlyDigits', function () {
    return {
      restrict: 'A',
      require: 'ngModel',
      link: function (scope, element, attrs, modelCtrl) {
        modelCtrl.$parsers.push(function (inputValue) {
          if (inputValue === undefined) return 1;
          if (inputValue.replace === undefined) return inputValue;
          var transformedInput = inputValue.replace(/[^0-9]/g, 1);
          if (transformedInput !== inputValue) {
            modelCtrl.$setViewValue(transformedInput);
            modelCtrl.$render();
          }
          return transformedInput;
        });
      }
    };
  })
  .directive('afterRepeat', function($timeout) {
    return function(scope, element, attrs) {
      if (scope.$last) {
        if (!first) {
          $timeout(function() {
            // angular.element(document.querySelector('#add_more')).triggerHandler('click');
            // close(1);
            _click_first_item(0);
          });
        }
      }
    };
  });
  app.filter('startFrom', function() {
    return function(input, start) {
      start = +start;
      return input.slice(start);
    };
  });

}());
function preview_image_upload(input) {
  if (input.files && input.files[0]) {
    var reader = new FileReader();
    reader.onload = function (e) {
      document.getElementById('preview_image').src = e.target.result;
    };
    reader.readAsDataURL(input.files[0]);
  }
}
function _click_first_item(_order) {
  var _elements = document.getElementsByClassName('ui-list-item');
  var _first = _elements[_order];
  if (_first !== undefined) _first.click();
  if (_first === undefined && _order === 1) {
    _order = 0;
    _first = _elements[_order];
    if (_first !== undefined) _first.click();
  }
  if (_first !== undefined) first = true;
}
function _change_status(_key) {
  var _element = document.getElementById(_key);
  if ((' ' + _element.className + ' ').indexOf(' ' + 'glyphicon-plus-sign' + ' ') > -1) {
    _element.classList.add('glyphicon-minus-sign');
    _element.classList.add('disabled');
    _element.classList.remove('glyphicon-plus-sign');
  } else {
    _element.classList.remove('glyphicon-minus-sign');
    _element.classList.remove('disabled');
    _element.classList.add('glyphicon-plus-sign');
  }
}
function _isObject (_item) {
  return (typeof _item === 'object' && !Array.isArray(_item) && _item !== null);
}
function daysInMonth(month, year) {
  return new Date(year, month, 0).getDate();
}
function _draw_working_hours_interval_5_minus(_per_minite) {
  var _return = [];
  var _start = 96;
  var _end = 252;
  if (_per_minite === undefined) {
    _per_minite = 5;
  } else {
    var _per = 60 / _per_minite;
    var _all = 24 * _per;
    _start = _per * 8;
    _end = _all - _per * 3;
  }
  _per_minite = parseInt(_per_minite, 10);

  for (var i = _start; i <= _end; i++) {
    var _minute = i * _per_minite;
    var _hour = parseInt(_minute / 60, 10);
    _minute = _hour * 60 - _minute;
    var _pm = 'pm';
    if (_minute < 0) _minute *= -1;
    if (_hour > 12) {
      _hour -= 12;
    } else {
      _pm = 'am';
    }
    if (_minute < 10) _minute = '0' + _minute;
    var _one = {
      '_id': (_hour + ':' + _minute + _pm),
      '_val': (_hour + ':' + _minute + ' ' + _pm)
    };
    _return.push(_one);
  }
  return _return;
}
function _isEmpty(obj) {
  for (var prop in obj) {
    if (obj.hasOwnProperty(prop)) return false;
  }
  return true;
}
Date.prototype.getMonthName = function() {
    let months = [ 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December' ];

    return months[this.getMonth()];
};
