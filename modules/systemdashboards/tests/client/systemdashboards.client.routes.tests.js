(function () {
  'use strict';

  describe('Systemdashboards Route Tests', function () {
    // Initialize global variables
    var $scope,
      SystemdashboardsService;

    // We can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($rootScope, _SystemdashboardsService_) {
      // Set a new global scope
      $scope = $rootScope.$new();
      SystemdashboardsService = _SystemdashboardsService_;
    }));

    describe('Route Config', function () {
      describe('Main Route', function () {
        var mainstate;
        beforeEach(inject(function ($state) {
          mainstate = $state.get('systemdashboards');
        }));

        it('Should have the correct URL', function () {
          expect(mainstate.url).toEqual('/systemdashboards');
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
          SystemdashboardsController,
          mockSystemdashboard;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          viewstate = $state.get('systemdashboards.view');
          $templateCache.put('modules/systemdashboards/client/views/view-systemdashboard.client.view.html', '');

          // create mock Systemdashboard
          mockSystemdashboard = new SystemdashboardsService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Systemdashboard Name'
          });

          // Initialize Controller
          SystemdashboardsController = $controller('SystemdashboardsController as vm', {
            $scope: $scope,
            systemdashboardResolve: mockSystemdashboard
          });
        }));

        it('Should have the correct URL', function () {
          expect(viewstate.url).toEqual('/:systemdashboardId');
        });

        it('Should have a resolve function', function () {
          expect(typeof viewstate.resolve).toEqual('object');
          expect(typeof viewstate.resolve.systemdashboardResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(viewstate, {
            systemdashboardId: 1
          })).toEqual('/systemdashboards/1');
        }));

        it('should attach an Systemdashboard to the controller scope', function () {
          expect($scope.vm.systemdashboard._id).toBe(mockSystemdashboard._id);
        });

        it('Should not be abstract', function () {
          expect(viewstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(viewstate.templateUrl).toBe('modules/systemdashboards/client/views/view-systemdashboard.client.view.html');
        });
      });

      describe('Create Route', function () {
        var createstate,
          SystemdashboardsController,
          mockSystemdashboard;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          createstate = $state.get('systemdashboards.create');
          $templateCache.put('modules/systemdashboards/client/views/form-systemdashboard.client.view.html', '');

          // create mock Systemdashboard
          mockSystemdashboard = new SystemdashboardsService();

          // Initialize Controller
          SystemdashboardsController = $controller('SystemdashboardsController as vm', {
            $scope: $scope,
            systemdashboardResolve: mockSystemdashboard
          });
        }));

        it('Should have the correct URL', function () {
          expect(createstate.url).toEqual('/create');
        });

        it('Should have a resolve function', function () {
          expect(typeof createstate.resolve).toEqual('object');
          expect(typeof createstate.resolve.systemdashboardResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(createstate)).toEqual('/systemdashboards/create');
        }));

        it('should attach an Systemdashboard to the controller scope', function () {
          expect($scope.vm.systemdashboard._id).toBe(mockSystemdashboard._id);
          expect($scope.vm.systemdashboard._id).toBe(undefined);
        });

        it('Should not be abstract', function () {
          expect(createstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(createstate.templateUrl).toBe('modules/systemdashboards/client/views/form-systemdashboard.client.view.html');
        });
      });

      describe('Edit Route', function () {
        var editstate,
          SystemdashboardsController,
          mockSystemdashboard;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          editstate = $state.get('systemdashboards.edit');
          $templateCache.put('modules/systemdashboards/client/views/form-systemdashboard.client.view.html', '');

          // create mock Systemdashboard
          mockSystemdashboard = new SystemdashboardsService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Systemdashboard Name'
          });

          // Initialize Controller
          SystemdashboardsController = $controller('SystemdashboardsController as vm', {
            $scope: $scope,
            systemdashboardResolve: mockSystemdashboard
          });
        }));

        it('Should have the correct URL', function () {
          expect(editstate.url).toEqual('/:systemdashboardId/edit');
        });

        it('Should have a resolve function', function () {
          expect(typeof editstate.resolve).toEqual('object');
          expect(typeof editstate.resolve.systemdashboardResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(editstate, {
            systemdashboardId: 1
          })).toEqual('/systemdashboards/1/edit');
        }));

        it('should attach an Systemdashboard to the controller scope', function () {
          expect($scope.vm.systemdashboard._id).toBe(mockSystemdashboard._id);
        });

        it('Should not be abstract', function () {
          expect(editstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(editstate.templateUrl).toBe('modules/systemdashboards/client/views/form-systemdashboard.client.view.html');
        });

        xit('Should go to unauthorized route', function () {

        });
      });

    });
  });
}());
