'use strict';

describe('Splitbills E2E Tests:', function () {
  describe('Test Splitbills page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/splitbills');
      expect(element.all(by.repeater('splitbill in splitbills')).count()).toEqual(0);
    });
  });
});
