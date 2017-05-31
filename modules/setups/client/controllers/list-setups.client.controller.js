(function () {
  'use strict';

  angular
    .module('setups')
    .controller('SetupsListController', SetupsListController);

  SetupsListController.$inject = ['SetupsService', '$http', 'Notification'];

  function SetupsListController(SetupsService, $http, Notification) {
    var vm = this;
    vm.setups = SetupsService.query();
    vm.title = 'SETTINGS';
    vm.updateStatus = updateStatus;
    function updateStatus (_alias, _key, _status) {
      var _element = document.getElementById(_key);
      var _val = _element.value;

      if (!_val && !_status) return ;
      
      if (_status) {        
        if ((' ' + _element.className + ' ').indexOf(' ' + 'glyphicon-plus-sign' + ' ') > -1) {
          _element.classList.add('glyphicon-minus-sign');
          _element.classList.add('disabled');
          _element.classList.remove('glyphicon-plus-sign');
          _val = 1;
        } else {
          _element.classList.remove('glyphicon-minus-sign');
          _element.classList.remove('disabled');
          _element.classList.add('glyphicon-plus-sign');
          _val = 0;
        }        
      }
      if (_key === 'is_send_email') {
        _val = !_val ? 1 : 0;
      }
      $http({
        method: 'POST',
        url: '/api/setups/quicksave',
        data: {
          'alias': _alias,
          'key': _key,
          'value': _val
        },
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
      }).success(function(data, status, headers, config) {
        Notification.success({ message: '<i class ="glyphicon glyphicon-ok"></i> Update successful!' });
      }).error(function(data, status, headers, config) {
        Notification.error({ message: '<i class ="glyphicon glyphicon-ok"></i> Error on update' });
      });
    }
  }
}());
