'use strict';

describe('Adminservices E2E Tests:', function () {
  describe('Test Adminservices page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/adminservices');
      expect(element.all(by.repeater('adminservice in adminservices')).count()).toEqual(0);
    });
  });
});
