(function () {
  'use strict';

  describe('Selectlists Route Tests', function () {
    // Initialize global variables
    var $scope,
      SelectlistsService;

    // We can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($rootScope, _SelectlistsService_) {
      // Set a new global scope
      $scope = $rootScope.$new();
      SelectlistsService = _SelectlistsService_;
    }));

    describe('Route Config', function () {
      describe('Main Route', function () {
        var mainstate;
        beforeEach(inject(function ($state) {
          mainstate = $state.get('selectlists');
        }));

        it('Should have the correct URL', function () {
          expect(mainstate.url).toEqual('/selectlists');
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
          SelectlistsController,
          mockSelectlist;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          viewstate = $state.get('selectlists.view');
          $templateCache.put('modules/selectlists/client/views/view-selectlist.client.view.html', '');

          // create mock Selectlist
          mockSelectlist = new SelectlistsService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Selectlist Name'
          });

          // Initialize Controller
          SelectlistsController = $controller('SelectlistsController as vm', {
            $scope: $scope,
            selectlistResolve: mockSelectlist
          });
        }));

        it('Should have the correct URL', function () {
          expect(viewstate.url).toEqual('/:selectlistId');
        });

        it('Should have a resolve function', function () {
          expect(typeof viewstate.resolve).toEqual('object');
          expect(typeof viewstate.resolve.selectlistResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(viewstate, {
            selectlistId: 1
          })).toEqual('/selectlists/1');
        }));

        it('should attach an Selectlist to the controller scope', function () {
          expect($scope.vm.selectlist._id).toBe(mockSelectlist._id);
        });

        it('Should not be abstract', function () {
          expect(viewstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(viewstate.templateUrl).toBe('modules/selectlists/client/views/view-selectlist.client.view.html');
        });
      });

      describe('Create Route', function () {
        var createstate,
          SelectlistsController,
          mockSelectlist;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          createstate = $state.get('selectlists.create');
          $templateCache.put('modules/selectlists/client/views/form-selectlist.client.view.html', '');

          // create mock Selectlist
          mockSelectlist = new SelectlistsService();

          // Initialize Controller
          SelectlistsController = $controller('SelectlistsController as vm', {
            $scope: $scope,
            selectlistResolve: mockSelectlist
          });
        }));

        it('Should have the correct URL', function () {
          expect(createstate.url).toEqual('/create');
        });

        it('Should have a resolve function', function () {
          expect(typeof createstate.resolve).toEqual('object');
          expect(typeof createstate.resolve.selectlistResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(createstate)).toEqual('/selectlists/create');
        }));

        it('should attach an Selectlist to the controller scope', function () {
          expect($scope.vm.selectlist._id).toBe(mockSelectlist._id);
          expect($scope.vm.selectlist._id).toBe(undefined);
        });

        it('Should not be abstract', function () {
          expect(createstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(createstate.templateUrl).toBe('modules/selectlists/client/views/form-selectlist.client.view.html');
        });
      });

      describe('Edit Route', function () {
        var editstate,
          SelectlistsController,
          mockSelectlist;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          editstate = $state.get('selectlists.edit');
          $templateCache.put('modules/selectlists/client/views/form-selectlist.client.view.html', '');

          // create mock Selectlist
          mockSelectlist = new SelectlistsService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Selectlist Name'
          });

          // Initialize Controller
          SelectlistsController = $controller('SelectlistsController as vm', {
            $scope: $scope,
            selectlistResolve: mockSelectlist
          });
        }));

        it('Should have the correct URL', function () {
          expect(editstate.url).toEqual('/:selectlistId/edit');
        });

        it('Should have a resolve function', function () {
          expect(typeof editstate.resolve).toEqual('object');
          expect(typeof editstate.resolve.selectlistResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(editstate, {
            selectlistId: 1
          })).toEqual('/selectlists/1/edit');
        }));

        it('should attach an Selectlist to the controller scope', function () {
          expect($scope.vm.selectlist._id).toBe(mockSelectlist._id);
        });

        it('Should not be abstract', function () {
          expect(editstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(editstate.templateUrl).toBe('modules/selectlists/client/views/form-selectlist.client.view.html');
        });

        xit('Should go to unauthorized route', function () {

        });
      });

    });
  });
}());
