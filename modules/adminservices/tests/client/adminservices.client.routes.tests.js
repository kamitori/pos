(function () {
  'use strict';

  describe('Adminservices Route Tests', function () {
    // Initialize global variables
    var $scope,
      AdminservicesService;

    // We can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($rootScope, _AdminservicesService_) {
      // Set a new global scope
      $scope = $rootScope.$new();
      AdminservicesService = _AdminservicesService_;
    }));

    describe('Route Config', function () {
      describe('Main Route', function () {
        var mainstate;
        beforeEach(inject(function ($state) {
          mainstate = $state.get('adminservices');
        }));

        it('Should have the correct URL', function () {
          expect(mainstate.url).toEqual('/adminservices');
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
          AdminservicesController,
          mockAdminservice;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          viewstate = $state.get('adminservices.view');
          $templateCache.put('modules/adminservices/client/views/view-adminservice.client.view.html', '');

          // create mock Adminservice
          mockAdminservice = new AdminservicesService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Adminservice Name'
          });

          // Initialize Controller
          AdminservicesController = $controller('AdminservicesController as vm', {
            $scope: $scope,
            adminserviceResolve: mockAdminservice
          });
        }));

        it('Should have the correct URL', function () {
          expect(viewstate.url).toEqual('/:adminserviceId');
        });

        it('Should have a resolve function', function () {
          expect(typeof viewstate.resolve).toEqual('object');
          expect(typeof viewstate.resolve.adminserviceResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(viewstate, {
            adminserviceId: 1
          })).toEqual('/adminservices/1');
        }));

        it('should attach an Adminservice to the controller scope', function () {
          expect($scope.vm.adminservice._id).toBe(mockAdminservice._id);
        });

        it('Should not be abstract', function () {
          expect(viewstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(viewstate.templateUrl).toBe('modules/adminservices/client/views/view-adminservice.client.view.html');
        });
      });

      describe('Create Route', function () {
        var createstate,
          AdminservicesController,
          mockAdminservice;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          createstate = $state.get('adminservices.create');
          $templateCache.put('modules/adminservices/client/views/form-adminservice.client.view.html', '');

          // create mock Adminservice
          mockAdminservice = new AdminservicesService();

          // Initialize Controller
          AdminservicesController = $controller('AdminservicesController as vm', {
            $scope: $scope,
            adminserviceResolve: mockAdminservice
          });
        }));

        it('Should have the correct URL', function () {
          expect(createstate.url).toEqual('/create');
        });

        it('Should have a resolve function', function () {
          expect(typeof createstate.resolve).toEqual('object');
          expect(typeof createstate.resolve.adminserviceResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(createstate)).toEqual('/adminservices/create');
        }));

        it('should attach an Adminservice to the controller scope', function () {
          expect($scope.vm.adminservice._id).toBe(mockAdminservice._id);
          expect($scope.vm.adminservice._id).toBe(undefined);
        });

        it('Should not be abstract', function () {
          expect(createstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(createstate.templateUrl).toBe('modules/adminservices/client/views/form-adminservice.client.view.html');
        });
      });

      describe('Edit Route', function () {
        var editstate,
          AdminservicesController,
          mockAdminservice;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          editstate = $state.get('adminservices.edit');
          $templateCache.put('modules/adminservices/client/views/form-adminservice.client.view.html', '');

          // create mock Adminservice
          mockAdminservice = new AdminservicesService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Adminservice Name'
          });

          // Initialize Controller
          AdminservicesController = $controller('AdminservicesController as vm', {
            $scope: $scope,
            adminserviceResolve: mockAdminservice
          });
        }));

        it('Should have the correct URL', function () {
          expect(editstate.url).toEqual('/:adminserviceId/edit');
        });

        it('Should have a resolve function', function () {
          expect(typeof editstate.resolve).toEqual('object');
          expect(typeof editstate.resolve.adminserviceResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(editstate, {
            adminserviceId: 1
          })).toEqual('/adminservices/1/edit');
        }));

        it('should attach an Adminservice to the controller scope', function () {
          expect($scope.vm.adminservice._id).toBe(mockAdminservice._id);
        });

        it('Should not be abstract', function () {
          expect(editstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(editstate.templateUrl).toBe('modules/adminservices/client/views/form-adminservice.client.view.html');
        });

        xit('Should go to unauthorized route', function () {

        });
      });

    });
  });
}());
