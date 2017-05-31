'use strict';

describe('Timeoffs E2E Tests:', function () {
  describe('Test Timeoffs page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/timeoffs');
      expect(element.all(by.repeater('timeoff in timeoffs')).count()).toEqual(0);
    });
  });
});
