'use strict';

/**
 * Module dependencies.
 */
var should = require('should'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Appintegration = mongoose.model('Appintegration');

/**
 * Globals
 */
var user,
  appintegration;

/**
 * Unit tests
 */
describe('Appintegration Model Unit Tests:', function() {
  beforeEach(function(done) {
    user = new User({
      first_name: 'Full',
      last_name: 'Name',
      displayName: 'Full Name',
      email: 'test@test.com',
      username: 'username',
      password: 'password'
    });

    user.save(function() {
      appintegration = new Appintegration({
        name: 'Appintegration Name',
        user: user
      });

      done();
    });
  });

  describe('Method Save', function() {
    it('should be able to save without problems', function(done) {
      this.timeout(0);
      return appintegration.save(function(err) {
        should.not.exist(err);
        done();
      });
    });

    it('should be able to show an error when try to save without name', function(done) {
      appintegration.name = '';

      return appintegration.save(function(err) {
        should.exist(err);
        done();
      });
    });
  });

  afterEach(function(done) {
    Appintegration.remove().exec(function() {
      User.remove().exec(function() {
        done();
      });
    });
  });
});
