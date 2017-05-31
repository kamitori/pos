// Accountplans service used to communicate Accountplans REST endpoints
(function () {
  'use strict';

  angular
    .module('accountplans')
    .factory('AccountplansService', AccountplansService);

  AccountplansService.$inject = ['$resource'];

  function AccountplansService($resource) {
    return $resource('/api/accountplans/:accountplanId', {
      accountplanId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
}());
