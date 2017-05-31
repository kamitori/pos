// Splitbills service used to communicate Splitbills REST endpoints
(function () {
  'use strict';

  angular
    .module('splitbills')
    .factory('SplitbillsService', SplitbillsService);

  SplitbillsService.$inject = ['$resource'];

  function SplitbillsService($resource) {
    return $resource('api/splitbills/:splitbillId', {
      splitbillId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
}());
