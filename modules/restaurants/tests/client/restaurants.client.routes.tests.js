(function () {
  'use strict';

  describe('Restaurants Route Tests', function () {
    // Initialize global variables
    var $scope,
      RestaurantsService;

    // We can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($rootScope, _RestaurantsService_) {
      // Set a new global scope
      $scope = $rootScope.$new();
      RestaurantsService = _RestaurantsService_;
    }));

    describe('Route Config', function () {
      describe('Main Route', function () {
        var mainstate;
        beforeEach(inject(function ($state) {
          mainstate = $state.get('restaurants');
        }));

        it('Should have the correct URL', function () {
          expect(mainstate.url).toEqual('/restaurants');
        });

        it('Should be abstract', function () {
          expect(mainstate.abstract).toBe(true);
        });

        it('Should have template', function () {
          expect(mainstate.template).toBe('<ui-view/>');
        });
      });

      describe('View Route', function () {
        var viewstate,
          RestaurantsController,
          mockRestaurant;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          viewstate = $state.get('restaurants.view');
          $templateCache.put('modules/restaurants/client/views/view-restaurant.client.view.html', '');

          // create mock Restaurant
          mockRestaurant = new RestaurantsService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Restaurant Name'
          });

          // Initialize Controller
          RestaurantsController = $controller('RestaurantsController as vm', {
            $scope: $scope,
            restaurantResolve: mockRestaurant
          });
        }));

        it('Should have the correct URL', function () {
          expect(viewstate.url).toEqual('/:restaurantId');
        });

        it('Should have a resolve function', function () {
          expect(typeof viewstate.resolve).toEqual('object');
          expect(typeof viewstate.resolve.restaurantResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(viewstate, {
            restaurantId: 1
          })).toEqual('/restaurants/1');
        }));

        it('should attach an Restaurant to the controller scope', function () {
          expect($scope.vm.restaurant._id).toBe(mockRestaurant._id);
        });

        it('Should not be abstract', function () {
          expect(viewstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(viewstate.templateUrl).toBe('modules/restaurants/client/views/view-restaurant.client.view.html');
        });
      });

      describe('Create Route', function () {
        var createstate,
          RestaurantsController,
          mockRestaurant;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          createstate = $state.get('restaurants.create');
          $templateCache.put('modules/restaurants/client/views/form-restaurant.client.view.html', '');

          // create mock Restaurant
          mockRestaurant = new RestaurantsService();

          // Initialize Controller
          RestaurantsController = $controller('RestaurantsController as vm', {
            $scope: $scope,
            restaurantResolve: mockRestaurant
          });
        }));

        it('Should have the correct URL', function () {
          expect(createstate.url).toEqual('/create');
        });

        it('Should have a resolve function', function () {
          expect(typeof createstate.resolve).toEqual('object');
          expect(typeof createstate.resolve.restaurantResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(createstate)).toEqual('/restaurants/create');
        }));

        it('should attach an Restaurant to the controller scope', function () {
          expect($scope.vm.restaurant._id).toBe(mockRestaurant._id);
          expect($scope.vm.restaurant._id).toBe(undefined);
        });

        it('Should not be abstract', function () {
          expect(createstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(createstate.templateUrl).toBe('modules/restaurants/client/views/form-restaurant.client.view.html');
        });
      });

      describe('Edit Route', function () {
        var editstate,
          RestaurantsController,
          mockRestaurant;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          editstate = $state.get('restaurants.edit');
          $templateCache.put('modules/restaurants/client/views/form-restaurant.client.view.html', '');

          // create mock Restaurant
          mockRestaurant = new RestaurantsService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Restaurant Name'
          });

          // Initialize Controller
          RestaurantsController = $controller('RestaurantsController as vm', {
            $scope: $scope,
            restaurantResolve: mockRestaurant
          });
        }));

        it('Should have the correct URL', function () {
          expect(editstate.url).toEqual('/:restaurantId/edit');
        });

        it('Should have a resolve function', function () {
          expect(typeof editstate.resolve).toEqual('object');
          expect(typeof editstate.resolve.restaurantResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(editstate, {
            restaurantId: 1
          })).toEqual('/restaurants/1/edit');
        }));

        it('should attach an Restaurant to the controller scope', function () {
          expect($scope.vm.restaurant._id).toBe(mockRestaurant._id);
        });

        it('Should not be abstract', function () {
          expect(editstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(editstate.templateUrl).toBe('modules/restaurants/client/views/form-restaurant.client.view.html');
        });

        xit('Should go to unauthorized route', function () {

        });
      });

    });
  });
}());
