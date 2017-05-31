(function () {
  'use strict';

  describe('Splitbills Route Tests', function () {
    // Initialize global variables
    var $scope,
      SplitbillsService;

    // We can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($rootScope, _SplitbillsService_) {
      // Set a new global scope
      $scope = $rootScope.$new();
      SplitbillsService = _SplitbillsService_;
    }));

    describe('Route Config', function () {
      describe('Main Route', function () {
        var mainstate;
        beforeEach(inject(function ($state) {
          mainstate = $state.get('splitbills');
        }));

        it('Should have the correct URL', function () {
          expect(mainstate.url).toEqual('/splitbills');
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
          SplitbillsController,
          mockSplitbill;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          viewstate = $state.get('splitbills.view');
          $templateCache.put('modules/splitbills/client/views/view-splitbill.client.view.html', '');

          // create mock Splitbill
          mockSplitbill = new SplitbillsService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Splitbill Name'
          });

          // Initialize Controller
          SplitbillsController = $controller('SplitbillsController as vm', {
            $scope: $scope,
            splitbillResolve: mockSplitbill
          });
        }));

        it('Should have the correct URL', function () {
          expect(viewstate.url).toEqual('/:splitbillId');
        });

        it('Should have a resolve function', function () {
          expect(typeof viewstate.resolve).toEqual('object');
          expect(typeof viewstate.resolve.splitbillResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(viewstate, {
            splitbillId: 1
          })).toEqual('/splitbills/1');
        }));

        it('should attach an Splitbill to the controller scope', function () {
          expect($scope.vm.splitbill._id).toBe(mockSplitbill._id);
        });

        it('Should not be abstract', function () {
          expect(viewstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(viewstate.templateUrl).toBe('modules/splitbills/client/views/view-splitbill.client.view.html');
        });
      });

      describe('Create Route', function () {
        var createstate,
          SplitbillsController,
          mockSplitbill;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          createstate = $state.get('splitbills.create');
          $templateCache.put('modules/splitbills/client/views/form-splitbill.client.view.html', '');

          // create mock Splitbill
          mockSplitbill = new SplitbillsService();

          // Initialize Controller
          SplitbillsController = $controller('SplitbillsController as vm', {
            $scope: $scope,
            splitbillResolve: mockSplitbill
          });
        }));

        it('Should have the correct URL', function () {
          expect(createstate.url).toEqual('/create');
        });

        it('Should have a resolve function', function () {
          expect(typeof createstate.resolve).toEqual('object');
          expect(typeof createstate.resolve.splitbillResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(createstate)).toEqual('/splitbills/create');
        }));

        it('should attach an Splitbill to the controller scope', function () {
          expect($scope.vm.splitbill._id).toBe(mockSplitbill._id);
          expect($scope.vm.splitbill._id).toBe(undefined);
        });

        it('Should not be abstract', function () {
          expect(createstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(createstate.templateUrl).toBe('modules/splitbills/client/views/form-splitbill.client.view.html');
        });
      });

      describe('Edit Route', function () {
        var editstate,
          SplitbillsController,
          mockSplitbill;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          editstate = $state.get('splitbills.edit');
          $templateCache.put('modules/splitbills/client/views/form-splitbill.client.view.html', '');

          // create mock Splitbill
          mockSplitbill = new SplitbillsService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Splitbill Name'
          });

          // Initialize Controller
          SplitbillsController = $controller('SplitbillsController as vm', {
            $scope: $scope,
            splitbillResolve: mockSplitbill
          });
        }));

        it('Should have the correct URL', function () {
          expect(editstate.url).toEqual('/:splitbillId/edit');
        });

        it('Should have a resolve function', function () {
          expect(typeof editstate.resolve).toEqual('object');
          expect(typeof editstate.resolve.splitbillResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(editstate, {
            splitbillId: 1
          })).toEqual('/splitbills/1/edit');
        }));

        it('should attach an Splitbill to the controller scope', function () {
          expect($scope.vm.splitbill._id).toBe(mockSplitbill._id);
        });

        it('Should not be abstract', function () {
          expect(editstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(editstate.templateUrl).toBe('modules/splitbills/client/views/form-splitbill.client.view.html');
        });

        xit('Should go to unauthorized route', function () {

        });
      });

    });
  });
}());
