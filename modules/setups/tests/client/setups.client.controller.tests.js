(function () {
  'use strict';

  describe('Setups Controller Tests', function () {
    // Initialize global variables
    var SetupsController,
      $scope,
      $httpBackend,
      $state,
      Authentication,
      SetupsService,
      mockSetup;

    // The $resource service augments the response object with methods for updating and deleting the resource.
    // If we were to use the standard toEqual matcher, our tests would fail because the test values would not match
    // the responses exactly. To solve the problem, we define a new toEqualData Jasmine matcher.
    // When the toEqualData matcher compares two objects, it takes only object properties into
    // account and ignores methods.
    beforeEach(function () {
      jasmine.addMatchers({
        toEqualData: function (util, customEqualityTesters) {
          return {
            compare: function (actual, expected) {
              return {
                pass: angular.equals(actual, expected)
              };
            }
          };
        }
      });
    });

    // Then we can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($controller, $rootScope, _$state_, _$httpBackend_, _Authentication_, _SetupsService_) {
      // Set a new global scope
      $scope = $rootScope.$new();

      // Point global variables to injected services
      $httpBackend = _$httpBackend_;
      $state = _$state_;
      Authentication = _Authentication_;
      SetupsService = _SetupsService_;

      // create mock Setup
      mockSetup = new SetupsService({
        _id: '525a8422f6d0f87f0e407a33',
        name: 'Setup Name'
      });

      // Mock logged in user
      Authentication.user = {
        roles: ['user']
      };

      // Initialize the Setups controller.
      SetupsController = $controller('SetupsController as vm', {
        $scope: $scope,
        setupResolve: {}
      });

      // Spy on state go
      spyOn($state, 'go');
    }));

    describe('vm.save() as create', function () {
      var sampleSetupPostData;

      beforeEach(function () {
        // Create a sample Setup object
        sampleSetupPostData = new SetupsService({
          name: 'Setup Name'
        });

        $scope.vm.setup = sampleSetupPostData;
      });

      it('should send a POST request with the form input values and then locate to new object URL', inject(function (SetupsService) {
        // Set POST response
        $httpBackend.expectPOST('api/setups', sampleSetupPostData).respond(mockSetup);

        // Run controller functionality
        $scope.vm.save(true);
        $httpBackend.flush();

        // Test URL redirection after the Setup was created
        expect($state.go).toHaveBeenCalledWith('setups.view', {
          setupId: mockSetup._id
        });
      }));

      it('should set $scope.vm.error if error', function () {
        var errorMessage = 'this is an error message';
        $httpBackend.expectPOST('api/setups', sampleSetupPostData).respond(400, {
          message: errorMessage
        });

        $scope.vm.save(true);
        $httpBackend.flush();

        expect($scope.vm.error).toBe(errorMessage);
      });
    });

    describe('vm.save() as update', function () {
      beforeEach(function () {
        // Mock Setup in $scope
        $scope.vm.setup = mockSetup;
      });

      it('should update a valid Setup', inject(function (SetupsService) {
        // Set PUT response
        $httpBackend.expectPUT(/api\/setups\/([0-9a-fA-F]{24})$/).respond();

        // Run controller functionality
        $scope.vm.save(true);
        $httpBackend.flush();

        // Test URL location to new object
        expect($state.go).toHaveBeenCalledWith('setups.view', {
          setupId: mockSetup._id
        });
      }));

      it('should set $scope.vm.error if error', inject(function (SetupsService) {
        var errorMessage = 'error';
        $httpBackend.expectPUT(/api\/setups\/([0-9a-fA-F]{24})$/).respond(400, {
          message: errorMessage
        });

        $scope.vm.save(true);
        $httpBackend.flush();

        expect($scope.vm.error).toBe(errorMessage);
      }));
    });

    describe('vm.remove()', function () {
      beforeEach(function () {
        // Setup Setups
        $scope.vm.setup = mockSetup;
      });

      it('should delete the Setup and redirect to Setups', function () {
        // Return true on confirm message
        spyOn(window, 'confirm').and.returnValue(true);

        $httpBackend.expectDELETE(/api\/setups\/([0-9a-fA-F]{24})$/).respond(204);

        $scope.vm.remove();
        $httpBackend.flush();

        expect($state.go).toHaveBeenCalledWith('setups.list');
      });

      it('should should not delete the Setup and not redirect', function () {
        // Return false on confirm message
        spyOn(window, 'confirm').and.returnValue(false);

        $scope.vm.remove();

        expect($state.go).not.toHaveBeenCalled();
      });
    });
  });
}());
