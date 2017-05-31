'use strict';

describe('Appintegrations E2E Tests:', function () {
  describe('Test Appintegrations page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/appintegrations');
      expect(element.all(by.repeater('appintegration in appintegrations')).count()).toEqual(0);
    });
  });
});
