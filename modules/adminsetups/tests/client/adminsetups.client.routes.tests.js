(function () {
  'use strict';

  describe('Adminsetups Route Tests', function () {
    // Initialize global variables
    var $scope,
      AdminsetupsService;

    // We can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($rootScope, _AdminsetupsService_) {
      // Set a new global scope
      $scope = $rootScope.$new();
      AdminsetupsService = _AdminsetupsService_;
    }));

    describe('Route Config', function () {
      describe('Main Route', function () {
        var mainstate;
        beforeEach(inject(function ($state) {
          mainstate = $state.get('adminsetups');
        }));

        it('Should have the correct URL', function () {
          expect(mainstate.url).toEqual('/adminsetups');
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
          AdminsetupsController,
          mockAdminsetup;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          viewstate = $state.get('adminsetups.view');
          $templateCache.put('modules/adminsetups/client/views/view-adminsetup.client.view.html', '');

          // create mock Adminsetup
          mockAdminsetup = new AdminsetupsService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Adminsetup Name'
          });

          // Initialize Controller
          AdminsetupsController = $controller('AdminsetupsController as vm', {
            $scope: $scope,
            adminsetupResolve: mockAdminsetup
          });
        }));

        it('Should have the correct URL', function () {
          expect(viewstate.url).toEqual('/:adminsetupId');
        });

        it('Should have a resolve function', function () {
          expect(typeof viewstate.resolve).toEqual('object');
          expect(typeof viewstate.resolve.adminsetupResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(viewstate, {
            adminsetupId: 1
          })).toEqual('/adminsetups/1');
        }));

        it('should attach an Adminsetup to the controller scope', function () {
          expect($scope.vm.adminsetup._id).toBe(mockAdminsetup._id);
        });

        it('Should not be abstract', function () {
          expect(viewstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(viewstate.templateUrl).toBe('modules/adminsetups/client/views/view-adminsetup.client.view.html');
        });
      });

      describe('Create Route', function () {
        var createstate,
          AdminsetupsController,
          mockAdminsetup;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          createstate = $state.get('adminsetups.create');
          $templateCache.put('modules/adminsetups/client/views/form-adminsetup.client.view.html', '');

          // create mock Adminsetup
          mockAdminsetup = new AdminsetupsService();

          // Initialize Controller
          AdminsetupsController = $controller('AdminsetupsController as vm', {
            $scope: $scope,
            adminsetupResolve: mockAdminsetup
          });
        }));

        it('Should have the correct URL', function () {
          expect(createstate.url).toEqual('/create');
        });

        it('Should have a resolve function', function () {
          expect(typeof createstate.resolve).toEqual('object');
          expect(typeof createstate.resolve.adminsetupResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(createstate)).toEqual('/adminsetups/create');
        }));

        it('should attach an Adminsetup to the controller scope', function () {
          expect($scope.vm.adminsetup._id).toBe(mockAdminsetup._id);
          expect($scope.vm.adminsetup._id).toBe(undefined);
        });

        it('Should not be abstract', function () {
          expect(createstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(createstate.templateUrl).toBe('modules/adminsetups/client/views/form-adminsetup.client.view.html');
        });
      });

      describe('Edit Route', function () {
        var editstate,
          AdminsetupsController,
          mockAdminsetup;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          editstate = $state.get('adminsetups.edit');
          $templateCache.put('modules/adminsetups/client/views/form-adminsetup.client.view.html', '');

          // create mock Adminsetup
          mockAdminsetup = new AdminsetupsService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Adminsetup Name'
          });

          // Initialize Controller
          AdminsetupsController = $controller('AdminsetupsController as vm', {
            $scope: $scope,
            adminsetupResolve: mockAdminsetup
          });
        }));

        it('Should have the correct URL', function () {
          expect(editstate.url).toEqual('/:adminsetupId/edit');
        });

        it('Should have a resolve function', function () {
          expect(typeof editstate.resolve).toEqual('object');
          expect(typeof editstate.resolve.adminsetupResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(editstate, {
            adminsetupId: 1
          })).toEqual('/adminsetups/1/edit');
        }));

        it('should attach an Adminsetup to the controller scope', function () {
          expect($scope.vm.adminsetup._id).toBe(mockAdminsetup._id);
        });

        it('Should not be abstract', function () {
          expect(editstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(editstate.templateUrl).toBe('modules/adminsetups/client/views/form-adminsetup.client.view.html');
        });

        xit('Should go to unauthorized route', function () {

        });
      });

    });
  });
}());
