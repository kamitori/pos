'use strict';

/**
 * Module dependencies.
 */
var should = require('should'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Adminsetup = mongoose.model('Adminsetup');

/**
 * Globals
 */
var user,
  adminsetup;

/**
 * Unit tests
 */
describe('Adminsetup Model Unit Tests:', function() {
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
      adminsetup = new Adminsetup({
        name: 'Adminsetup Name',
        user: user
      });

      done();
    });
  });

  describe('Method Save', function() {
    it('should be able to save without problems', function(done) {
      this.timeout(0);
      return adminsetup.save(function(err) {
        should.not.exist(err);
        done();
      });
    });

    it('should be able to show an error when try to save without name', function(done) {
      adminsetup.name = '';

      return adminsetup.save(function(err) {
        should.exist(err);
        done();
      });
    });
  });

  afterEach(function(done) {
    Adminsetup.remove().exec(function() {
      User.remove().exec(function() {
        done();
      });
    });
  });
});
