(function () {
  'use strict';

  describe('Settingsaccounts Route Tests', function () {
    // Initialize global variables
    var $scope,
      SettingsaccountsService;

    // We can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($rootScope, _SettingsaccountsService_) {
      // Set a new global scope
      $scope = $rootScope.$new();
      SettingsaccountsService = _SettingsaccountsService_;
    }));

    describe('Route Config', function () {
      describe('Main Route', function () {
        var mainstate;
        beforeEach(inject(function ($state) {
          mainstate = $state.get('settingsaccounts');
        }));

        it('Should have the correct URL', function () {
          expect(mainstate.url).toEqual('/settingsaccounts');
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
          SettingsaccountsController,
          mockSettingsaccount;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          viewstate = $state.get('settingsaccounts.view');
          $templateCache.put('modules/settingsaccounts/client/views/view-settingsaccount.client.view.html', '');

          // create mock Settingsaccount
          mockSettingsaccount = new SettingsaccountsService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Settingsaccount Name'
          });

          // Initialize Controller
          SettingsaccountsController = $controller('SettingsaccountsController as vm', {
            $scope: $scope,
            settingsaccountResolve: mockSettingsaccount
          });
        }));

        it('Should have the correct URL', function () {
          expect(viewstate.url).toEqual('/:settingsaccountId');
        });

        it('Should have a resolve function', function () {
          expect(typeof viewstate.resolve).toEqual('object');
          expect(typeof viewstate.resolve.settingsaccountResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(viewstate, {
            settingsaccountId: 1
          })).toEqual('/settingsaccounts/1');
        }));

        it('should attach an Settingsaccount to the controller scope', function () {
          expect($scope.vm.settingsaccount._id).toBe(mockSettingsaccount._id);
        });

        it('Should not be abstract', function () {
          expect(viewstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(viewstate.templateUrl).toBe('modules/settingsaccounts/client/views/view-settingsaccount.client.view.html');
        });
      });

      describe('Create Route', function () {
        var createstate,
          SettingsaccountsController,
          mockSettingsaccount;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          createstate = $state.get('settingsaccounts.create');
          $templateCache.put('modules/settingsaccounts/client/views/form-settingsaccount.client.view.html', '');

          // create mock Settingsaccount
          mockSettingsaccount = new SettingsaccountsService();

          // Initialize Controller
          SettingsaccountsController = $controller('SettingsaccountsController as vm', {
            $scope: $scope,
            settingsaccountResolve: mockSettingsaccount
          });
        }));

        it('Should have the correct URL', function () {
          expect(createstate.url).toEqual('/create');
        });

        it('Should have a resolve function', function () {
          expect(typeof createstate.resolve).toEqual('object');
          expect(typeof createstate.resolve.settingsaccountResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(createstate)).toEqual('/settingsaccounts/create');
        }));

        it('should attach an Settingsaccount to the controller scope', function () {
          expect($scope.vm.settingsaccount._id).toBe(mockSettingsaccount._id);
          expect($scope.vm.settingsaccount._id).toBe(undefined);
        });

        it('Should not be abstract', function () {
          expect(createstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(createstate.templateUrl).toBe('modules/settingsaccounts/client/views/form-settingsaccount.client.view.html');
        });
      });

      describe('Edit Route', function () {
        var editstate,
          SettingsaccountsController,
          mockSettingsaccount;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          editstate = $state.get('settingsaccounts.edit');
          $templateCache.put('modules/settingsaccounts/client/views/form-settingsaccount.client.view.html', '');

          // create mock Settingsaccount
          mockSettingsaccount = new SettingsaccountsService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Settingsaccount Name'
          });

          // Initialize Controller
          SettingsaccountsController = $controller('SettingsaccountsController as vm', {
            $scope: $scope,
            settingsaccountResolve: mockSettingsaccount
          });
        }));

        it('Should have the correct URL', function () {
          expect(editstate.url).toEqual('/:settingsaccountId/edit');
        });

        it('Should have a resolve function', function () {
          expect(typeof editstate.resolve).toEqual('object');
          expect(typeof editstate.resolve.settingsaccountResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(editstate, {
            settingsaccountId: 1
          })).toEqual('/settingsaccounts/1/edit');
        }));

        it('should attach an Settingsaccount to the controller scope', function () {
          expect($scope.vm.settingsaccount._id).toBe(mockSettingsaccount._id);
        });

        it('Should not be abstract', function () {
          expect(editstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(editstate.templateUrl).toBe('modules/settingsaccounts/client/views/form-settingsaccount.client.view.html');
        });

        xit('Should go to unauthorized route', function () {

        });
      });

    });
  });
}());
