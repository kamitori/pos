(function () {
  'use strict';

  describe('Accountplans Route Tests', function () {
    // Initialize global variables
    var $scope,
      AccountplansService;

    // We can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($rootScope, _AccountplansService_) {
      // Set a new global scope
      $scope = $rootScope.$new();
      AccountplansService = _AccountplansService_;
    }));

    describe('Route Config', function () {
      describe('Main Route', function () {
        var mainstate;
        beforeEach(inject(function ($state) {
          mainstate = $state.get('accountplans');
        }));

        it('Should have the correct URL', function () {
          expect(mainstate.url).toEqual('/accountplans');
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
          AccountplansController,
          mockAccountplan;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          viewstate = $state.get('accountplans.view');
          $templateCache.put('modules/accountplans/client/views/view-accountplan.client.view.html', '');

          // create mock Accountplan
          mockAccountplan = new AccountplansService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Accountplan Name'
          });

          // Initialize Controller
          AccountplansController = $controller('AccountplansController as vm', {
            $scope: $scope,
            accountplanResolve: mockAccountplan
          });
        }));

        it('Should have the correct URL', function () {
          expect(viewstate.url).toEqual('/:accountplanId');
        });

        it('Should have a resolve function', function () {
          expect(typeof viewstate.resolve).toEqual('object');
          expect(typeof viewstate.resolve.accountplanResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(viewstate, {
            accountplanId: 1
          })).toEqual('/accountplans/1');
        }));

        it('should attach an Accountplan to the controller scope', function () {
          expect($scope.vm.accountplan._id).toBe(mockAccountplan._id);
        });

        it('Should not be abstract', function () {
          expect(viewstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(viewstate.templateUrl).toBe('modules/accountplans/client/views/view-accountplan.client.view.html');
        });
      });

      describe('Create Route', function () {
        var createstate,
          AccountplansController,
          mockAccountplan;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          createstate = $state.get('accountplans.create');
          $templateCache.put('modules/accountplans/client/views/form-accountplan.client.view.html', '');

          // create mock Accountplan
          mockAccountplan = new AccountplansService();

          // Initialize Controller
          AccountplansController = $controller('AccountplansController as vm', {
            $scope: $scope,
            accountplanResolve: mockAccountplan
          });
        }));

        it('Should have the correct URL', function () {
          expect(createstate.url).toEqual('/create');
        });

        it('Should have a resolve function', function () {
          expect(typeof createstate.resolve).toEqual('object');
          expect(typeof createstate.resolve.accountplanResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(createstate)).toEqual('/accountplans/create');
        }));

        it('should attach an Accountplan to the controller scope', function () {
          expect($scope.vm.accountplan._id).toBe(mockAccountplan._id);
          expect($scope.vm.accountplan._id).toBe(undefined);
        });

        it('Should not be abstract', function () {
          expect(createstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(createstate.templateUrl).toBe('modules/accountplans/client/views/form-accountplan.client.view.html');
        });
      });

      describe('Edit Route', function () {
        var editstate,
          AccountplansController,
          mockAccountplan;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          editstate = $state.get('accountplans.edit');
          $templateCache.put('modules/accountplans/client/views/form-accountplan.client.view.html', '');

          // create mock Accountplan
          mockAccountplan = new AccountplansService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Accountplan Name'
          });

          // Initialize Controller
          AccountplansController = $controller('AccountplansController as vm', {
            $scope: $scope,
            accountplanResolve: mockAccountplan
          });
        }));

        it('Should have the correct URL', function () {
          expect(editstate.url).toEqual('/:accountplanId/edit');
        });

        it('Should have a resolve function', function () {
          expect(typeof editstate.resolve).toEqual('object');
          expect(typeof editstate.resolve.accountplanResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(editstate, {
            accountplanId: 1
          })).toEqual('/accountplans/1/edit');
        }));

        it('should attach an Accountplan to the controller scope', function () {
          expect($scope.vm.accountplan._id).toBe(mockAccountplan._id);
        });

        it('Should not be abstract', function () {
          expect(editstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(editstate.templateUrl).toBe('modules/accountplans/client/views/form-accountplan.client.view.html');
        });

        xit('Should go to unauthorized route', function () {

        });
      });

    });
  });
}());
