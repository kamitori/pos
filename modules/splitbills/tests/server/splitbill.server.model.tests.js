'use strict';

/**
 * Module dependencies.
 */
var should = require('should'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Splitbill = mongoose.model('Splitbill');

/**
 * Globals
 */
var user,
  splitbill;

/**
 * Unit tests
 */
describe('Splitbill Model Unit Tests:', function() {
  beforeEach(function(done) {
    user = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'test@test.com',
      username: 'username',
      password: 'password'
    });

    user.save(function() {
      splitbill = new Splitbill({
        name: 'Splitbill Name',
        user: user
      });

      done();
    });
  });

  describe('Method Save', function() {
    it('should be able to save without problems', function(done) {
      this.timeout(0);
      return splitbill.save(function(err) {
        should.not.exist(err);
        done();
      });
    });

    it('should be able to show an error when try to save without name', function(done) {
      splitbill.name = '';

      return splitbill.save(function(err) {
        should.exist(err);
        done();
      });
    });
  });

  afterEach(function(done) {
    Splitbill.remove().exec(function() {
      User.remove().exec(function() {
        done();
      });
    });
  });
});
