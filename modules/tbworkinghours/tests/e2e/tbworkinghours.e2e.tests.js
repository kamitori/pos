'use strict';

describe('Tbworkinghours E2E Tests:', function () {
  describe('Test Tbworkinghours page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/tbworkinghours');
      expect(element.all(by.repeater('tbworkinghour in tbworkinghours')).count()).toEqual(0);
    });
  });
});
