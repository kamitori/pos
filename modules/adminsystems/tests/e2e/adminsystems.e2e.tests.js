'use strict';

describe('Adminsystems E2E Tests:', function () {
  describe('Test Adminsystems page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/adminsystems');
      expect(element.all(by.repeater('adminsystem in adminsystems')).count()).toEqual(0);
    });
  });
});
