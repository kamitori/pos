'use strict';

describe('Settingsaccounts E2E Tests:', function () {
  describe('Test Settingsaccounts page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/settingsaccounts');
      expect(element.all(by.repeater('settingsaccount in settingsaccounts')).count()).toEqual(0);
    });
  });
});
