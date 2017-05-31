'use strict';

/**
 * Module dependencies.
 */
var should = require('should'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Accountplan = mongoose.model('Accountplan');

/**
 * Globals
 */
var user,
  accountplan;

/**
 * Unit tests
 */
describe('Accountplan Model Unit Tests:', function() {
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
      accountplan = new Accountplan({
        name: 'Accountplan Name',
        user: user
      });

      done();
    });
  });

  describe('Method Save', function() {
    it('should be able to save without problems', function(done) {
      this.timeout(0);
      return accountplan.save(function(err) {
        should.not.exist(err);
        done();
      });
    });

    it('should be able to show an error when try to save without name', function(done) {
      accountplan.name = '';

      return accountplan.save(function(err) {
        should.exist(err);
        done();
      });
    });
  });

  afterEach(function(done) {
    Accountplan.remove().exec(function() {
      User.remove().exec(function() {
        done();
      });
    });
  });
});
