'use strict';

describe('Systemdashboards E2E Tests:', function () {
  describe('Test Systemdashboards page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/systemdashboards');
      expect(element.all(by.repeater('systemdashboard in systemdashboards')).count()).toEqual(0);
    });
  });
});
