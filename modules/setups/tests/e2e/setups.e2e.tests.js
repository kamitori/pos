'use strict';

describe('Setups E2E Tests:', function () {
  describe('Test Setups page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/setups');
      expect(element.all(by.repeater('setup in setups')).count()).toEqual(0);
    });
  });
});
