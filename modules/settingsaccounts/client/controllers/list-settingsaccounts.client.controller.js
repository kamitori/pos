(function () {
  'use strict';

  var app = angular
    .module('settingsaccounts')
    .controller('SettingsaccountsListController', SettingsaccountsListController);

  SettingsaccountsListController.$inject = ['$scope', 'SettingsaccountsService', 'Authentication', 'AdminservicesService', 'CustomersService', '$http', 'Notification', '$timeout', 'Upload'];

  function SettingsaccountsListController($scope, SettingsaccountsService, Authentication, AdminservicesService, CustomersService, $http, Notification, $timeout, Upload) {

    var vm = this;
    vm.login_user = Authentication.user;
    vm.changeTest = function () {
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
            document.getElementById('preview_image').src = '/img/staffs/' + new_name;
            $http({
              method: 'POST',
              url: '/api/settingsaccounts/quicksave',
              data: {
                'alias': 'photo',
                'key': vm.current_user._id,
                'val': ('/img/staffs/' + new_name)
              },
              headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
            }).success(function(data, status, headers, config) {
              Notification.success({ message: '<i class="glyphicon glyphicon-ok"></i> ' + data + '!' });
            }).error(function(data, status, headers, config) {
              Notification.error({ message: '<i class="glyphicon glyphicon-ok"></i> ' + data });
            });
          }          
        }).error(function (errorResponse) {
        });
      });
    };
    vm.current_user = null;
    vm.title = 'SETTINGS';
    vm.listStaffs = SettingsaccountsService.query();
    $http({
      method: 'POST',
      url: '/api/settingsaccounts/getcurrentuser',
      data: {
        'customer': vm.login_user._id
      },
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    }).success(function(data, status, headers, config) {
      vm.current_user = data;
    }).error(function(data, status, headers, config) {
      Notification.error({ message: '<i class="glyphicon glyphicon-ok"></i> ' + data });
    });
    vm.draw_start_hours = _draw_start_hours();
    vm.getIndex = function (_index, _type) {
      if (_index === undefined) {
        if (_type) _index = '8:00am';
        else _index = '5:00pm';
      }
    };
    vm.quickupdate = function (_val_key) {
      var _val = vm.current_user[_val_key];
      if (_val_key == 'our_rep_id') {
        var _element = document.getElementById(_val_key);        
        var _text = _element.options[_element.selectedIndex].innerHTML;        
        _val = {
          'id': _val,
          'name': _text
        }
      }
      $http({
        method: 'POST',
        url: '/api/settingsaccounts/quicksave',
        data: {
          'alias': _val_key,
          'key': vm.current_user._id,
          'val': _val
        },
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
      }).success(function(data, status, headers, config) {
        Notification.success({ message: '<i class="glyphicon glyphicon-ok"></i> ' + data + '!' });
      }).error(function(data, status, headers, config) {
        Notification.error({ message: '<i class="glyphicon glyphicon-ok"></i> ' + data });
      });
    };
  }
}());

function _draw_start_hours() {
  var _per_minite = 60;
  var _return = [];
  for (var i = 1; i <= 24; i++) {
    var _hour = i;
    var _pm = 'pm';

    if (_hour > 12) {
      _hour -= 12;
    } else {
      _pm = 'am';
    }
    var _one = {
      '_id': (_hour + ':00' + _pm),
      '_val': (_hour + ':00' + ' ' + _pm)
    };
    _return.push((_hour + ':00' + ' ' + _pm));
  }
  return _return;
}

function preview_image_upload(input) {
  // if (input.files && input.files[0]) {
  //   var reader = new FileReader();
  //   reader.onload = function (e) {
  //     document.getElementById('preview_image').src = e.target.result;
  //   };
  //   reader.readAsDataURL(input.files[0]);
  // }
}
