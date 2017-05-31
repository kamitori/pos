'use strict';

describe('Salesreports E2E Tests:', function () {
  describe('Test Salesreports page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/salesreports');
      expect(element.all(by.repeater('salesreport in salesreports')).count()).toEqual(0);
    });
  });
});
