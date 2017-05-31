'use strict';

/**
 * Module dependencies.
 */
var should = require('should'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Adminservice = mongoose.model('Adminservice');

/**
 * Globals
 */
var user,
  adminservice;

/**
 * Unit tests
 */
describe('Adminservice Model Unit Tests:', function() {
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
      adminservice = new Adminservice({
        name: 'Adminservice Name',
        user: user
      });

      done();
    });
  });

  describe('Method Save', function() {
    it('should be able to save without problems', function(done) {
      this.timeout(0);
      return adminservice.save(function(err) {
        should.not.exist(err);
        done();
      });
    });

    it('should be able to show an error when try to save without name', function(done) {
      adminservice.name = '';

      return adminservice.save(function(err) {
        should.exist(err);
        done();
      });
    });
  });

  afterEach(function(done) {
    Adminservice.remove().exec(function() {
      User.remove().exec(function() {
        done();
      });
    });
  });
});
