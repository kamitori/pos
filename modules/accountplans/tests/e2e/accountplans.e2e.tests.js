'use strict';

describe('Accountplans E2E Tests:', function () {
  describe('Test Accountplans page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/accountplans');
      expect(element.all(by.repeater('accountplan in accountplans')).count()).toEqual(0);
    });
  });
});
