(function () {
  'use strict';

  describe('Stations Route Tests', function () {
    // Initialize global variables
    var $scope,
      StationsService;

    // We can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($rootScope, _StationsService_) {
      // Set a new global scope
      $scope = $rootScope.$new();
      StationsService = _StationsService_;
    }));

    describe('Route Config', function () {
      describe('Main Route', function () {
        var mainstate;
        beforeEach(inject(function ($state) {
          mainstate = $state.get('stations');
        }));

        it('Should have the correct URL', function () {
          expect(mainstate.url).toEqual('/stations');
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
          StationsController,
          mockStation;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          viewstate = $state.get('stations.view');
          $templateCache.put('modules/stations/client/views/view-station.client.view.html', '');

          // create mock Station
          mockStation = new StationsService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Station Name'
          });

          // Initialize Controller
          StationsController = $controller('StationsController as vm', {
            $scope: $scope,
            stationResolve: mockStation
          });
        }));

        it('Should have the correct URL', function () {
          expect(viewstate.url).toEqual('/:stationId');
        });

        it('Should have a resolve function', function () {
          expect(typeof viewstate.resolve).toEqual('object');
          expect(typeof viewstate.resolve.stationResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(viewstate, {
            stationId: 1
          })).toEqual('/stations/1');
        }));

        it('should attach an Station to the controller scope', function () {
          expect($scope.vm.station._id).toBe(mockStation._id);
        });

        it('Should not be abstract', function () {
          expect(viewstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(viewstate.templateUrl).toBe('modules/stations/client/views/view-station.client.view.html');
        });
      });

      describe('Create Route', function () {
        var createstate,
          StationsController,
          mockStation;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          createstate = $state.get('stations.create');
          $templateCache.put('modules/stations/client/views/form-station.client.view.html', '');

          // create mock Station
          mockStation = new StationsService();

          // Initialize Controller
          StationsController = $controller('StationsController as vm', {
            $scope: $scope,
            stationResolve: mockStation
          });
        }));

        it('Should have the correct URL', function () {
          expect(createstate.url).toEqual('/create');
        });

        it('Should have a resolve function', function () {
          expect(typeof createstate.resolve).toEqual('object');
          expect(typeof createstate.resolve.stationResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(createstate)).toEqual('/stations/create');
        }));

        it('should attach an Station to the controller scope', function () {
          expect($scope.vm.station._id).toBe(mockStation._id);
          expect($scope.vm.station._id).toBe(undefined);
        });

        it('Should not be abstract', function () {
          expect(createstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(createstate.templateUrl).toBe('modules/stations/client/views/form-station.client.view.html');
        });
      });

      describe('Edit Route', function () {
        var editstate,
          StationsController,
          mockStation;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          editstate = $state.get('stations.edit');
          $templateCache.put('modules/stations/client/views/form-station.client.view.html', '');

          // create mock Station
          mockStation = new StationsService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Station Name'
          });

          // Initialize Controller
          StationsController = $controller('StationsController as vm', {
            $scope: $scope,
            stationResolve: mockStation
          });
        }));

        it('Should have the correct URL', function () {
          expect(editstate.url).toEqual('/:stationId/edit');
        });

        it('Should have a resolve function', function () {
          expect(typeof editstate.resolve).toEqual('object');
          expect(typeof editstate.resolve.stationResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(editstate, {
            stationId: 1
          })).toEqual('/stations/1/edit');
        }));

        it('should attach an Station to the controller scope', function () {
          expect($scope.vm.station._id).toBe(mockStation._id);
        });

        it('Should not be abstract', function () {
          expect(editstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(editstate.templateUrl).toBe('modules/stations/client/views/form-station.client.view.html');
        });

        xit('Should go to unauthorized route', function () {

        });
      });

    });
  });
}());
