(function () {
  'use strict';

  // Adminservices controller
  var app = angular.module('adminservices')
    .controller('AdminservicesController', AdminservicesController);

  AdminservicesController.$inject = ['$scope', '$state', '$window', 'Authentication', 'adminserviceResolve', 'Upload', 'Notification'];

  function AdminservicesController ($scope, $state, $window, Authentication, adminservice, Upload, Notification) {
    var vm = this;

    vm.authentication = Authentication;
    vm.adminservice = adminservice;
    vm.title = 'SETTINGS';
    vm.adminservice.alias = null;    
    if (vm.adminservice._id === undefined) {
      vm.adminservice.sprice = 0;
      vm.adminservice.sduration = 0;
      vm.adminservice.extratime = 0;
    }
    vm.draw_cate_type = draw_cate_type();    
    vm.get_index_datas = function (_type) {
      for (var i in vm.draw_cate_type) {
        if (vm.draw_cate_type[i]._id === _type) {
          return vm.draw_cate_type[i];
        }
      }
      console.log(_type)
      if (_type === undefined) return vm.draw_cate_type[1];
      return vm.draw_cate_type[1];
    };    
    function draw_cate_type () {
      
      var _return = [];
      var _one = {
        '_id': 'checf_cook',
        '_val': 'Kitchen - ChefCook'
      };
      _return.push(_one);
      var _one = {
        '_id': 'dish_washer',
        '_val': 'Kitchen - Dish Washer'
      };
      _return.push(_one);
      return _return;
    };
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;
    // Remove existing Adminservice
    function remove() {
      if ($window.confirm('Are you sure you want to delete?')) {
        vm.adminservice.$remove($state.go('adminservices.list'));
      }
    }

    // Save Adminservice
    function save(isValid) {
      console.log(vm.adminservice);
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.adminserviceForm');
        return false;
      }
      vm.adminservice.alias = _remove_vn_(vm.adminservice.name);
      $scope.$watch('file', function() {
        $scope.upload = Upload.upload({
          url: '/api/adminservices/saveimage',
          method: 'POST',
          headers: { 'Content-Type': 'multipart/form-data' },
          file: $scope.file
        }).success(function (response, status) {
          var d = new Date();
          var datetimestamp = d.getMonth() + '-' + d.getDate() + '-' + d.getFullYear();
          if ($scope.file && $scope.file.name) {
            var old_name = $scope.file.name;
            var new_name = old_name.split('.')[0] + '-' + datetimestamp + '.' + old_name.split('.')[old_name.split('.').length - 1];
            vm.adminservice.imgthumb = '/img/services/' + new_name;
          }
          if (vm.adminservice._id) {
            vm.adminservice.$update(successCallback, errorCallback);
          } else {
            vm.adminservice.$save(successCallback, errorCallback);
          }
        }).error(function (errorResponse) {
          $scope.error = errorResponse.data;
        });
      });

      function successCallback(res) {
        Notification.success({ message: '<i class="glyphicon glyphicon-ok"></i> Create Service successful!' });
        // $state.go('adminservices.list', {
        //   adminserviceId: res._id
        // });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }

  }
  app.filter('numberFixedLen', function () {
    return function (n) {
      var num = parseInt(n, 10);
      return num;
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
