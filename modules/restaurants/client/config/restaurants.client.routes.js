(function () {
  'use strict';

  angular
    .module('restaurants')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('restaurants', {
        abstract: true,
        url: '/restaurants',
        template: '<ui-view/>'
      })
      .state('restaurants.list', {
        url: '',
        templateUrl: 'modules/restaurants/client/views/list-restaurants.client.view.html',
        controller: 'RestaurantsListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Restaurants List'
        }
      })
      .state('restaurants.create', {
        url: '/create',
        templateUrl: 'modules/restaurants/client/views/form-restaurant.client.view.html',
        controller: 'RestaurantsController',
        controllerAs: 'vm',
        resolve: {
          restaurantResolve: newRestaurant
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Restaurants Create'
        }
      })
      .state('restaurants.edit', {
        url: '/:restaurantId/edit',
        templateUrl: 'modules/restaurants/client/views/form-restaurant.client.view.html',
        controller: 'RestaurantsController',
        controllerAs: 'vm',
        resolve: {
          restaurantResolve: getRestaurant
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Edit Restaurant {{ restaurantResolve.name }}'
        }
      })
      .state('restaurants.view', {
        url: '/:restaurantId',
        templateUrl: 'modules/restaurants/client/views/view-restaurant.client.view.html',
        controller: 'RestaurantsController',
        controllerAs: 'vm',
        resolve: {
          restaurantResolve: getRestaurant
        },
        data: {
          pageTitle: 'Restaurant {{ restaurantResolve.name }}'
        }
      });
  }

  getRestaurant.$inject = ['$stateParams', 'RestaurantsService'];

  function getRestaurant($stateParams, RestaurantsService) {
    return RestaurantsService.get({
      restaurantId: $stateParams.restaurantId
    }).$promise;
  }

  newRestaurant.$inject = ['RestaurantsService'];

  function newRestaurant(RestaurantsService) {
    return new RestaurantsService();
  }
}());
