// Restaurants service used to communicate Restaurants REST endpoints
(function () {
  'use strict';

  angular
    .module('restaurants')
    .factory('RestaurantsService', RestaurantsService);

  RestaurantsService.$inject = ['$resource'];

  function RestaurantsService($resource) {
    return $resource('api/restaurants/:restaurantId', {
      restaurantId: '@_id'
    }, {
      update: { method: 'PUT' },
      getListRestaurantInArray: { method: 'PUT', param:{}, isArray:true}
    });
  }
}());
