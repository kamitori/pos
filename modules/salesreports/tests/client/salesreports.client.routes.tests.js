(function () {
  'use strict';

  describe('Salesreports Route Tests', function () {
    // Initialize global variables
    var $scope,
      SalesreportsService;

    // We can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($rootScope, _SalesreportsService_) {
      // Set a new global scope
      $scope = $rootScope.$new();
      SalesreportsService = _SalesreportsService_;
    }));

    describe('Route Config', function () {
      describe('Main Route', function () {
        var mainstate;
        beforeEach(inject(function ($state) {
          mainstate = $state.get('salesreports');
        }));

        it('Should have the correct URL', function () {
          expect(mainstate.url).toEqual('/salesreports');
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
          SalesreportsController,
          mockSalesreport;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          viewstate = $state.get('salesreports.view');
          $templateCache.put('modules/salesreports/client/views/view-salesreport.client.view.html', '');

          // create mock Salesreport
          mockSalesreport = new SalesreportsService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Salesreport Name'
          });

          // Initialize Controller
          SalesreportsController = $controller('SalesreportsController as vm', {
            $scope: $scope,
            salesreportResolve: mockSalesreport
          });
        }));

        it('Should have the correct URL', function () {
          expect(viewstate.url).toEqual('/:salesreportId');
        });

        it('Should have a resolve function', function () {
          expect(typeof viewstate.resolve).toEqual('object');
          expect(typeof viewstate.resolve.salesreportResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(viewstate, {
            salesreportId: 1
          })).toEqual('/salesreports/1');
        }));

        it('should attach an Salesreport to the controller scope', function () {
          expect($scope.vm.salesreport._id).toBe(mockSalesreport._id);
        });

        it('Should not be abstract', function () {
          expect(viewstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(viewstate.templateUrl).toBe('modules/salesreports/client/views/view-salesreport.client.view.html');
        });
      });

      describe('Create Route', function () {
        var createstate,
          SalesreportsController,
          mockSalesreport;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          createstate = $state.get('salesreports.create');
          $templateCache.put('modules/salesreports/client/views/form-salesreport.client.view.html', '');

          // create mock Salesreport
          mockSalesreport = new SalesreportsService();

          // Initialize Controller
          SalesreportsController = $controller('SalesreportsController as vm', {
            $scope: $scope,
            salesreportResolve: mockSalesreport
          });
        }));

        it('Should have the correct URL', function () {
          expect(createstate.url).toEqual('/create');
        });

        it('Should have a resolve function', function () {
          expect(typeof createstate.resolve).toEqual('object');
          expect(typeof createstate.resolve.salesreportResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(createstate)).toEqual('/salesreports/create');
        }));

        it('should attach an Salesreport to the controller scope', function () {
          expect($scope.vm.salesreport._id).toBe(mockSalesreport._id);
          expect($scope.vm.salesreport._id).toBe(undefined);
        });

        it('Should not be abstract', function () {
          expect(createstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(createstate.templateUrl).toBe('modules/salesreports/client/views/form-salesreport.client.view.html');
        });
      });

      describe('Edit Route', function () {
        var editstate,
          SalesreportsController,
          mockSalesreport;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          editstate = $state.get('salesreports.edit');
          $templateCache.put('modules/salesreports/client/views/form-salesreport.client.view.html', '');

          // create mock Salesreport
          mockSalesreport = new SalesreportsService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Salesreport Name'
          });

          // Initialize Controller
          SalesreportsController = $controller('SalesreportsController as vm', {
            $scope: $scope,
            salesreportResolve: mockSalesreport
          });
        }));

        it('Should have the correct URL', function () {
          expect(editstate.url).toEqual('/:salesreportId/edit');
        });

        it('Should have a resolve function', function () {
          expect(typeof editstate.resolve).toEqual('object');
          expect(typeof editstate.resolve.salesreportResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(editstate, {
            salesreportId: 1
          })).toEqual('/salesreports/1/edit');
        }));

        it('should attach an Salesreport to the controller scope', function () {
          expect($scope.vm.salesreport._id).toBe(mockSalesreport._id);
        });

        it('Should not be abstract', function () {
          expect(editstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(editstate.templateUrl).toBe('modules/salesreports/client/views/form-salesreport.client.view.html');
        });

        xit('Should go to unauthorized route', function () {

        });
      });

    });
  });
}());
