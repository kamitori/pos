(function () {
  'use strict';

  describe('Tbworkinghours Route Tests', function () {
    // Initialize global variables
    var $scope,
      TbworkinghoursService;

    // We can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($rootScope, _TbworkinghoursService_) {
      // Set a new global scope
      $scope = $rootScope.$new();
      TbworkinghoursService = _TbworkinghoursService_;
    }));

    describe('Route Config', function () {
      describe('Main Route', function () {
        var mainstate;
        beforeEach(inject(function ($state) {
          mainstate = $state.get('tbworkinghours');
        }));

        it('Should have the correct URL', function () {
          expect(mainstate.url).toEqual('/tbworkinghours');
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
          TbworkinghoursController,
          mockTbworkinghour;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          viewstate = $state.get('tbworkinghours.view');
          $templateCache.put('modules/tbworkinghours/client/views/view-tbworkinghour.client.view.html', '');

          // create mock Tbworkinghour
          mockTbworkinghour = new TbworkinghoursService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Tbworkinghour Name'
          });

          // Initialize Controller
          TbworkinghoursController = $controller('TbworkinghoursController as vm', {
            $scope: $scope,
            tbworkinghourResolve: mockTbworkinghour
          });
        }));

        it('Should have the correct URL', function () {
          expect(viewstate.url).toEqual('/:tbworkinghourId');
        });

        it('Should have a resolve function', function () {
          expect(typeof viewstate.resolve).toEqual('object');
          expect(typeof viewstate.resolve.tbworkinghourResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(viewstate, {
            tbworkinghourId: 1
          })).toEqual('/tbworkinghours/1');
        }));

        it('should attach an Tbworkinghour to the controller scope', function () {
          expect($scope.vm.tbworkinghour._id).toBe(mockTbworkinghour._id);
        });

        it('Should not be abstract', function () {
          expect(viewstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(viewstate.templateUrl).toBe('modules/tbworkinghours/client/views/view-tbworkinghour.client.view.html');
        });
      });

      describe('Create Route', function () {
        var createstate,
          TbworkinghoursController,
          mockTbworkinghour;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          createstate = $state.get('tbworkinghours.create');
          $templateCache.put('modules/tbworkinghours/client/views/form-tbworkinghour.client.view.html', '');

          // create mock Tbworkinghour
          mockTbworkinghour = new TbworkinghoursService();

          // Initialize Controller
          TbworkinghoursController = $controller('TbworkinghoursController as vm', {
            $scope: $scope,
            tbworkinghourResolve: mockTbworkinghour
          });
        }));

        it('Should have the correct URL', function () {
          expect(createstate.url).toEqual('/create');
        });

        it('Should have a resolve function', function () {
          expect(typeof createstate.resolve).toEqual('object');
          expect(typeof createstate.resolve.tbworkinghourResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(createstate)).toEqual('/tbworkinghours/create');
        }));

        it('should attach an Tbworkinghour to the controller scope', function () {
          expect($scope.vm.tbworkinghour._id).toBe(mockTbworkinghour._id);
          expect($scope.vm.tbworkinghour._id).toBe(undefined);
        });

        it('Should not be abstract', function () {
          expect(createstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(createstate.templateUrl).toBe('modules/tbworkinghours/client/views/form-tbworkinghour.client.view.html');
        });
      });

      describe('Edit Route', function () {
        var editstate,
          TbworkinghoursController,
          mockTbworkinghour;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          editstate = $state.get('tbworkinghours.edit');
          $templateCache.put('modules/tbworkinghours/client/views/form-tbworkinghour.client.view.html', '');

          // create mock Tbworkinghour
          mockTbworkinghour = new TbworkinghoursService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Tbworkinghour Name'
          });

          // Initialize Controller
          TbworkinghoursController = $controller('TbworkinghoursController as vm', {
            $scope: $scope,
            tbworkinghourResolve: mockTbworkinghour
          });
        }));

        it('Should have the correct URL', function () {
          expect(editstate.url).toEqual('/:tbworkinghourId/edit');
        });

        it('Should have a resolve function', function () {
          expect(typeof editstate.resolve).toEqual('object');
          expect(typeof editstate.resolve.tbworkinghourResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(editstate, {
            tbworkinghourId: 1
          })).toEqual('/tbworkinghours/1/edit');
        }));

        it('should attach an Tbworkinghour to the controller scope', function () {
          expect($scope.vm.tbworkinghour._id).toBe(mockTbworkinghour._id);
        });

        it('Should not be abstract', function () {
          expect(editstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(editstate.templateUrl).toBe('modules/tbworkinghours/client/views/form-tbworkinghour.client.view.html');
        });

        xit('Should go to unauthorized route', function () {

        });
      });

    });
  });
}());
