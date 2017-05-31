(function () {
  'use strict';

  var app = angular
    .module('adminservices')
    .controller('AdminservicesListController', AdminservicesListController);

  AdminservicesListController.$inject = ['AdminservicesService', '$scope', '$window', 'Notification', '$http'];

  app.directive('onlyDigits', function () {
    return {
      restrict: 'A',
      require: 'ngModel',
      link: function (scope, element, attrs, modelCtrl) {
        modelCtrl.$parsers.push(function (inputValue) {
          if (inputValue === undefined) return 1;
          if (inputValue.replace === undefined) return inputValue;
          var transformedInput = inputValue.replace(/[^0-9]/g, '1');
          if (transformedInput !== inputValue) {
            modelCtrl.$setViewValue(transformedInput);
            modelCtrl.$render();
          }
          return transformedInput;
        });
      }
    };
  });

  app.filter('startFrom', function() {
    return function(input, start) {
      start = +start;
      return input.slice(start);
    };
  });

  function AdminservicesListController (AdminservicesService, $scope, $window, Notification, $http) {
    var vm = this;
    vm.title = 'SETTINGS';
    vm.adminservices = AdminservicesService.query();
    vm.currentPage = 0;
    vm.pageSize = 10;
    vm.q = '';
    vm.returnColor = function (_color) {
      var re = /[0-9A-Fa-f]{6}/g;
      if (re.test(_color)) {
        if (_color.indexOf('#') > -1) return _color;
        return '#' + _color;
      }      
      return _color;
    };
    $scope.options = {
      // html attributes 
      required: [false, true],
      disabled: [false, true],
      placeholder: '',
      inputClass: 'hidden',
      id: undefined,
      name: undefined,
      // validation 
      restrictToFormat: [false, true],
      allowEmpty: [false, true],
      // color 
      format: ['hsl', 'hsv', 'rgb', 'hex', 'hexString', 'hex8', 'hex8String', 'raw'],
      hue: [true, false],
      saturation: [false, true],
      lightness: [false, true], // Note: In the square mode this is HSV and in round mode this is HSL 
      alpha: [true, false],
      case: ['upper', 'lower'],
      // swatch 
      swatch: [true, false],
      swatchPos: ['left', 'right'],
      swatchBootstrap: [true, false],
      swatchOnly: [true, false],
      // popup 
      round: [false, true],
      pos: ['bottom left', 'bottom right', 'top left', 'top right'],
      inline: [false, true],
      // show/hide 
      show: {
          swatch: [true, false],
          focus: [true, false],
      },
      hide: {
          blur: [true, false],
          escape: [true, false],
          click: [true, false],
      },
      // buttons 
      close: {
          show: [false, true],
          label: 'Close',
          class: '',
      },
      clear: {
          show: [false, true],
          label: 'Clear',
          class: '',
      },
      reset: {
          show: [false, true],
          label: 'Reset',
          class: '',
      },
    };

    vm.click_cate = function (_text) {
      $http({
        method: 'POST',
        url: '/api/adminservices/filterdata',
        data: {
          'name': _text
        },
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
      }).success(function(data, status, headers, config) {
        vm.adminservices = data;
        // $state.reload();
      }).error(function(data, status, headers, config) {
        console.log(data)
      });      
    };
    vm.removeById = removeById;
    
    vm.changeData = function () {
      vm.currentPage = parseInt(document.getElementById('run_link').value, 10) - 1;
      if (vm.currentPage <= 0) vm.currentPage = 1;
      if (vm.currentPage >= vm.numberOfPages()) vm.currentPage = vm.numberOfPages();
    };

    vm.numberOfPages = function () {
      return Math.ceil(vm.adminservices.length / vm.pageSize);
    };
    
   
    function removeById (str) {
      var adminservice = str.adminservice;
      if ($window.confirm('Are you sure you want to delete : ' + str.adminservice.name)) {
        adminservice.$remove();
        _remove_element_by_id_(adminservice._id);
        _remove_element_by_id_('div' + adminservice._id);
        Notification.success({ message: '<i class="glyphicon glyphicon-ok"></i> Delete ' + str.adminservice.name + ' successful!' });
      }
    }
  }
}());
function _remove_element_by_id_ (str) {
  document.getElementById(str).remove();
}

