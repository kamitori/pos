'use strict';

describe('Mainstations E2E Tests:', function () {
  describe('Test Mainstations page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/mainstations');
      expect(element.all(by.repeater('mainstation in mainstations')).count()).toEqual(0);
    });
  });
});
