'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Accountplan = mongoose.model('Accountplan'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app,
  agent,
  credentials,
  user,
  accountplan;

/**
 * Accountplan routes tests
 */
describe('Accountplan CRUD tests', function () {

  before(function (done) {
    // Get application
    app = express.init(mongoose);
    agent = request.agent(app);

    done();
  });

  beforeEach(function (done) {
    // Create user credentials
    credentials = {
      username: 'username',
      password: 'M3@n.jsI$Aw3$0m3'
    };

    // Create a new user
    user = new User({
      first_name: 'Full',
      last_name: 'Name',
      displayName: 'Full Name',
      email: 'test@test.com',
      username: credentials.username,
      password: credentials.password,
      provider: 'local'
    });

    // Save a user to the test db and create new Accountplan
    user.save(function () {
      accountplan = {
        name: 'Accountplan name'
      };

      done();
    });
  });

  it('should be able to save a Accountplan if logged in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Accountplan
        agent.post('/api/accountplans')
          .send(accountplan)
          .expect(200)
          .end(function (accountplanSaveErr, accountplanSaveRes) {
            // Handle Accountplan save error
            if (accountplanSaveErr) {
              return done(accountplanSaveErr);
            }

            // Get a list of Accountplans
            agent.get('/api/accountplans')
              .end(function (accountplansGetErr, accountplansGetRes) {
                // Handle Accountplans save error
                if (accountplansGetErr) {
                  return done(accountplansGetErr);
                }

                // Get Accountplans list
                var accountplans = accountplansGetRes.body;

                // Set assertions
                (accountplans[0].user._id).should.equal(userId);
                (accountplans[0].name).should.match('Accountplan name');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an Accountplan if not logged in', function (done) {
    agent.post('/api/accountplans')
      .send(accountplan)
      .expect(403)
      .end(function (accountplanSaveErr, accountplanSaveRes) {
        // Call the assertion callback
        done(accountplanSaveErr);
      });
  });

  it('should not be able to save an Accountplan if no name is provided', function (done) {
    // Invalidate name field
    accountplan.name = '';

    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Accountplan
        agent.post('/api/accountplans')
          .send(accountplan)
          .expect(400)
          .end(function (accountplanSaveErr, accountplanSaveRes) {
            // Set message assertion
            (accountplanSaveRes.body.message).should.match('Please fill Accountplan name');

            // Handle Accountplan save error
            done(accountplanSaveErr);
          });
      });
  });

  it('should be able to update an Accountplan if signed in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Accountplan
        agent.post('/api/accountplans')
          .send(accountplan)
          .expect(200)
          .end(function (accountplanSaveErr, accountplanSaveRes) {
            // Handle Accountplan save error
            if (accountplanSaveErr) {
              return done(accountplanSaveErr);
            }

            // Update Accountplan name
            accountplan.name = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing Accountplan
            agent.put('/api/accountplans/' + accountplanSaveRes.body._id)
              .send(accountplan)
              .expect(200)
              .end(function (accountplanUpdateErr, accountplanUpdateRes) {
                // Handle Accountplan update error
                if (accountplanUpdateErr) {
                  return done(accountplanUpdateErr);
                }

                // Set assertions
                (accountplanUpdateRes.body._id).should.equal(accountplanSaveRes.body._id);
                (accountplanUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of Accountplans if not signed in', function (done) {
    // Create new Accountplan model instance
    var accountplanObj = new Accountplan(accountplan);

    // Save the accountplan
    accountplanObj.save(function () {
      // Request Accountplans
      request(app).get('/api/accountplans')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single Accountplan if not signed in', function (done) {
    // Create new Accountplan model instance
    var accountplanObj = new Accountplan(accountplan);

    // Save the Accountplan
    accountplanObj.save(function () {
      request(app).get('/api/accountplans/' + accountplanObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('name', accountplan.name);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single Accountplan with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/accountplans/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Accountplan is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single Accountplan which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent Accountplan
    request(app).get('/api/accountplans/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No Accountplan with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an Accountplan if signed in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Accountplan
        agent.post('/api/accountplans')
          .send(accountplan)
          .expect(200)
          .end(function (accountplanSaveErr, accountplanSaveRes) {
            // Handle Accountplan save error
            if (accountplanSaveErr) {
              return done(accountplanSaveErr);
            }

            // Delete an existing Accountplan
            agent.delete('/api/accountplans/' + accountplanSaveRes.body._id)
              .send(accountplan)
              .expect(200)
              .end(function (accountplanDeleteErr, accountplanDeleteRes) {
                // Handle accountplan error error
                if (accountplanDeleteErr) {
                  return done(accountplanDeleteErr);
                }

                // Set assertions
                (accountplanDeleteRes.body._id).should.equal(accountplanSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an Accountplan if not signed in', function (done) {
    // Set Accountplan user
    accountplan.user = user;

    // Create new Accountplan model instance
    var accountplanObj = new Accountplan(accountplan);

    // Save the Accountplan
    accountplanObj.save(function () {
      // Try deleting Accountplan
      request(app).delete('/api/accountplans/' + accountplanObj._id)
        .expect(403)
        .end(function (accountplanDeleteErr, accountplanDeleteRes) {
          // Set message assertion
          (accountplanDeleteRes.body.message).should.match('User is not authorized');

          // Handle Accountplan error error
          done(accountplanDeleteErr);
        });

    });
  });

  it('should be able to get a single Accountplan that has an orphaned user reference', function (done) {
    // Create orphan user creds
    var _creds = {
      username: 'orphan',
      password: 'M3@n.jsI$Aw3$0m3'
    };

    // Create orphan user
    var _orphan = new User({
      first_name: 'Full',
      last_name: 'Name',
      displayName: 'Full Name',
      email: 'orphan@test.com',
      username: _creds.username,
      password: _creds.password,
      provider: 'local'
    });

    _orphan.save(function (err, orphan) {
      // Handle save error
      if (err) {
        return done(err);
      }

      agent.post('/api/auth/signin')
        .send(_creds)
        .expect(200)
        .end(function (signinErr, signinRes) {
          // Handle signin error
          if (signinErr) {
            return done(signinErr);
          }

          // Get the userId
          var orphanId = orphan._id;

          // Save a new Accountplan
          agent.post('/api/accountplans')
            .send(accountplan)
            .expect(200)
            .end(function (accountplanSaveErr, accountplanSaveRes) {
              // Handle Accountplan save error
              if (accountplanSaveErr) {
                return done(accountplanSaveErr);
              }

              // Set assertions on new Accountplan
              (accountplanSaveRes.body.name).should.equal(accountplan.name);
              should.exist(accountplanSaveRes.body.user);
              should.equal(accountplanSaveRes.body.user._id, orphanId);

              // force the Accountplan to have an orphaned user reference
              orphan.remove(function () {
                // now signin with valid user
                agent.post('/api/auth/signin')
                  .send(credentials)
                  .expect(200)
                  .end(function (err, res) {
                    // Handle signin error
                    if (err) {
                      return done(err);
                    }

                    // Get the Accountplan
                    agent.get('/api/accountplans/' + accountplanSaveRes.body._id)
                      .expect(200)
                      .end(function (accountplanInfoErr, accountplanInfoRes) {
                        // Handle Accountplan error
                        if (accountplanInfoErr) {
                          return done(accountplanInfoErr);
                        }

                        // Set assertions
                        (accountplanInfoRes.body._id).should.equal(accountplanSaveRes.body._id);
                        (accountplanInfoRes.body.name).should.equal(accountplan.name);
                        should.equal(accountplanInfoRes.body.user, undefined);

                        // Call the assertion callback
                        done();
                      });
                  });
              });
            });
        });
    });
  });

  afterEach(function (done) {
    User.remove().exec(function () {
      Accountplan.remove().exec(done);
    });
  });
});
