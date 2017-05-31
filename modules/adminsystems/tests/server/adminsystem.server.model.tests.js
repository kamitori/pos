'use strict';

/**
 * Module dependencies.
 */
var should = require('should'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Adminsystem = mongoose.model('Adminsystem');

/**
 * Globals
 */
var user,
  adminsystem;

/**
 * Unit tests
 */
describe('Adminsystem Model Unit Tests:', function() {
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
      adminsystem = new Adminsystem({
        name: 'Adminsystem Name',
        user: user
      });

      done();
    });
  });

  describe('Method Save', function() {
    it('should be able to save without problems', function(done) {
      this.timeout(0);
      return adminsystem.save(function(err) {
        should.not.exist(err);
        done();
      });
    });

    it('should be able to show an error when try to save without name', function(done) {
      adminsystem.name = '';

      return adminsystem.save(function(err) {
        should.exist(err);
        done();
      });
    });
  });

  afterEach(function(done) {
    Adminsystem.remove().exec(function() {
      User.remove().exec(function() {
        done();
      });
    });
  });
});
