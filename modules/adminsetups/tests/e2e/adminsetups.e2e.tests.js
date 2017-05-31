'use strict';

describe('Adminsetups E2E Tests:', function () {
  describe('Test Adminsetups page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/adminsetups');
      expect(element.all(by.repeater('adminsetup in adminsetups')).count()).toEqual(0);
    });
  });
});
