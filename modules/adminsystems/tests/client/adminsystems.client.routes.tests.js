(function () {
  'use strict';

  describe('Adminsystems Route Tests', function () {
    // Initialize global variables
    var $scope,
      AdminsystemsService;

    // We can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($rootScope, _AdminsystemsService_) {
      // Set a new global scope
      $scope = $rootScope.$new();
      AdminsystemsService = _AdminsystemsService_;
    }));

    describe('Route Config', function () {
      describe('Main Route', function () {
        var mainstate;
        beforeEach(inject(function ($state) {
          mainstate = $state.get('adminsystems');
        }));

        it('Should have the correct URL', function () {
          expect(mainstate.url).toEqual('/adminsystems');
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
          AdminsystemsController,
          mockAdminsystem;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          viewstate = $state.get('adminsystems.view');
          $templateCache.put('modules/adminsystems/client/views/view-adminsystem.client.view.html', '');

          // create mock Adminsystem
          mockAdminsystem = new AdminsystemsService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Adminsystem Name'
          });

          // Initialize Controller
          AdminsystemsController = $controller('AdminsystemsController as vm', {
            $scope: $scope,
            adminsystemResolve: mockAdminsystem
          });
        }));

        it('Should have the correct URL', function () {
          expect(viewstate.url).toEqual('/:adminsystemId');
        });

        it('Should have a resolve function', function () {
          expect(typeof viewstate.resolve).toEqual('object');
          expect(typeof viewstate.resolve.adminsystemResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(viewstate, {
            adminsystemId: 1
          })).toEqual('/adminsystems/1');
        }));

        it('should attach an Adminsystem to the controller scope', function () {
          expect($scope.vm.adminsystem._id).toBe(mockAdminsystem._id);
        });

        it('Should not be abstract', function () {
          expect(viewstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(viewstate.templateUrl).toBe('modules/adminsystems/client/views/view-adminsystem.client.view.html');
        });
      });

      describe('Create Route', function () {
        var createstate,
          AdminsystemsController,
          mockAdminsystem;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          createstate = $state.get('adminsystems.create');
          $templateCache.put('modules/adminsystems/client/views/form-adminsystem.client.view.html', '');

          // create mock Adminsystem
          mockAdminsystem = new AdminsystemsService();

          // Initialize Controller
          AdminsystemsController = $controller('AdminsystemsController as vm', {
            $scope: $scope,
            adminsystemResolve: mockAdminsystem
          });
        }));

        it('Should have the correct URL', function () {
          expect(createstate.url).toEqual('/create');
        });

        it('Should have a resolve function', function () {
          expect(typeof createstate.resolve).toEqual('object');
          expect(typeof createstate.resolve.adminsystemResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(createstate)).toEqual('/adminsystems/create');
        }));

        it('should attach an Adminsystem to the controller scope', function () {
          expect($scope.vm.adminsystem._id).toBe(mockAdminsystem._id);
          expect($scope.vm.adminsystem._id).toBe(undefined);
        });

        it('Should not be abstract', function () {
          expect(createstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(createstate.templateUrl).toBe('modules/adminsystems/client/views/form-adminsystem.client.view.html');
        });
      });

      describe('Edit Route', function () {
        var editstate,
          AdminsystemsController,
          mockAdminsystem;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          editstate = $state.get('adminsystems.edit');
          $templateCache.put('modules/adminsystems/client/views/form-adminsystem.client.view.html', '');

          // create mock Adminsystem
          mockAdminsystem = new AdminsystemsService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Adminsystem Name'
          });

          // Initialize Controller
          AdminsystemsController = $controller('AdminsystemsController as vm', {
            $scope: $scope,
            adminsystemResolve: mockAdminsystem
          });
        }));

        it('Should have the correct URL', function () {
          expect(editstate.url).toEqual('/:adminsystemId/edit');
        });

        it('Should have a resolve function', function () {
          expect(typeof editstate.resolve).toEqual('object');
          expect(typeof editstate.resolve.adminsystemResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(editstate, {
            adminsystemId: 1
          })).toEqual('/adminsystems/1/edit');
        }));

        it('should attach an Adminsystem to the controller scope', function () {
          expect($scope.vm.adminsystem._id).toBe(mockAdminsystem._id);
        });

        it('Should not be abstract', function () {
          expect(editstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(editstate.templateUrl).toBe('modules/adminsystems/client/views/form-adminsystem.client.view.html');
        });

        xit('Should go to unauthorized route', function () {

        });
      });

    });
  });
}());
