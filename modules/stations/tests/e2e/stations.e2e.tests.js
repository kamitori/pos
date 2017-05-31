'use strict';

describe('Stations E2E Tests:', function () {
  describe('Test Stations page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/stations');
      expect(element.all(by.repeater('station in stations')).count()).toEqual(0);
    });
  });
});
