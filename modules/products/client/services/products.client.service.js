// Products service used to communicate Products REST endpoints
(function () {
  'use strict';

  angular
    .module('products')
    .factory('ProductsService', ProductsService);

  ProductsService.$inject = ['$resource'];

  function ProductsService($resource) {
    return $resource('api/products/:productId', {
      productId: '@_id'
    }, {
      update: { method: 'PUT' },
      getProductByCategory: { method: 'PUT', param: {}, isArray: true },
      getProductOptions: { method: 'PUT', param: {} },
      getProduct: { method: 'PUT', param: {} }
    });
  }
}());
