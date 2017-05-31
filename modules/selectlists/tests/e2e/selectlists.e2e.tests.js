'use strict';

describe('Selectlists E2E Tests:', function () {
  describe('Test Selectlists page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/selectlists');
      expect(element.all(by.repeater('selectlist in selectlists')).count()).toEqual(0);
    });
  });
});
