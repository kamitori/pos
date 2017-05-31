'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Adminsystem = mongoose.model('Adminsystem'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app,
  agent,
  credentials,
  user,
  adminsystem;

/**
 * Adminsystem routes tests
 */
describe('Adminsystem CRUD tests', function () {

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

    // Save a user to the test db and create new Adminsystem
    user.save(function () {
      adminsystem = {
        name: 'Adminsystem name'
      };

      done();
    });
  });

  it('should be able to save a Adminsystem if logged in', function (done) {
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

        // Save a new Adminsystem
        agent.post('/api/adminsystems')
          .send(adminsystem)
          .expect(200)
          .end(function (adminsystemSaveErr, adminsystemSaveRes) {
            // Handle Adminsystem save error
            if (adminsystemSaveErr) {
              return done(adminsystemSaveErr);
            }

            // Get a list of Adminsystems
            agent.get('/api/adminsystems')
              .end(function (adminsystemsGetErr, adminsystemsGetRes) {
                // Handle Adminsystems save error
                if (adminsystemsGetErr) {
                  return done(adminsystemsGetErr);
                }

                // Get Adminsystems list
                var adminsystems = adminsystemsGetRes.body;

                // Set assertions
                (adminsystems[0].user._id).should.equal(userId);
                (adminsystems[0].name).should.match('Adminsystem name');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an Adminsystem if not logged in', function (done) {
    agent.post('/api/adminsystems')
      .send(adminsystem)
      .expect(403)
      .end(function (adminsystemSaveErr, adminsystemSaveRes) {
        // Call the assertion callback
        done(adminsystemSaveErr);
      });
  });

  it('should not be able to save an Adminsystem if no name is provided', function (done) {
    // Invalidate name field
    adminsystem.name = '';

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

        // Save a new Adminsystem
        agent.post('/api/adminsystems')
          .send(adminsystem)
          .expect(400)
          .end(function (adminsystemSaveErr, adminsystemSaveRes) {
            // Set message assertion
            (adminsystemSaveRes.body.message).should.match('Please fill Adminsystem name');

            // Handle Adminsystem save error
            done(adminsystemSaveErr);
          });
      });
  });

  it('should be able to update an Adminsystem if signed in', function (done) {
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

        // Save a new Adminsystem
        agent.post('/api/adminsystems')
          .send(adminsystem)
          .expect(200)
          .end(function (adminsystemSaveErr, adminsystemSaveRes) {
            // Handle Adminsystem save error
            if (adminsystemSaveErr) {
              return done(adminsystemSaveErr);
            }

            // Update Adminsystem name
            adminsystem.name = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing Adminsystem
            agent.put('/api/adminsystems/' + adminsystemSaveRes.body._id)
              .send(adminsystem)
              .expect(200)
              .end(function (adminsystemUpdateErr, adminsystemUpdateRes) {
                // Handle Adminsystem update error
                if (adminsystemUpdateErr) {
                  return done(adminsystemUpdateErr);
                }

                // Set assertions
                (adminsystemUpdateRes.body._id).should.equal(adminsystemSaveRes.body._id);
                (adminsystemUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of Adminsystems if not signed in', function (done) {
    // Create new Adminsystem model instance
    var adminsystemObj = new Adminsystem(adminsystem);

    // Save the adminsystem
    adminsystemObj.save(function () {
      // Request Adminsystems
      request(app).get('/api/adminsystems')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single Adminsystem if not signed in', function (done) {
    // Create new Adminsystem model instance
    var adminsystemObj = new Adminsystem(adminsystem);

    // Save the Adminsystem
    adminsystemObj.save(function () {
      request(app).get('/api/adminsystems/' + adminsystemObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('name', adminsystem.name);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single Adminsystem with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/adminsystems/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Adminsystem is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single Adminsystem which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent Adminsystem
    request(app).get('/api/adminsystems/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No Adminsystem with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an Adminsystem if signed in', function (done) {
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

        // Save a new Adminsystem
        agent.post('/api/adminsystems')
          .send(adminsystem)
          .expect(200)
          .end(function (adminsystemSaveErr, adminsystemSaveRes) {
            // Handle Adminsystem save error
            if (adminsystemSaveErr) {
              return done(adminsystemSaveErr);
            }

            // Delete an existing Adminsystem
            agent.delete('/api/adminsystems/' + adminsystemSaveRes.body._id)
              .send(adminsystem)
              .expect(200)
              .end(function (adminsystemDeleteErr, adminsystemDeleteRes) {
                // Handle adminsystem error error
                if (adminsystemDeleteErr) {
                  return done(adminsystemDeleteErr);
                }

                // Set assertions
                (adminsystemDeleteRes.body._id).should.equal(adminsystemSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an Adminsystem if not signed in', function (done) {
    // Set Adminsystem user
    adminsystem.user = user;

    // Create new Adminsystem model instance
    var adminsystemObj = new Adminsystem(adminsystem);

    // Save the Adminsystem
    adminsystemObj.save(function () {
      // Try deleting Adminsystem
      request(app).delete('/api/adminsystems/' + adminsystemObj._id)
        .expect(403)
        .end(function (adminsystemDeleteErr, adminsystemDeleteRes) {
          // Set message assertion
          (adminsystemDeleteRes.body.message).should.match('User is not authorized');

          // Handle Adminsystem error error
          done(adminsystemDeleteErr);
        });

    });
  });

  it('should be able to get a single Adminsystem that has an orphaned user reference', function (done) {
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

          // Save a new Adminsystem
          agent.post('/api/adminsystems')
            .send(adminsystem)
            .expect(200)
            .end(function (adminsystemSaveErr, adminsystemSaveRes) {
              // Handle Adminsystem save error
              if (adminsystemSaveErr) {
                return done(adminsystemSaveErr);
              }

              // Set assertions on new Adminsystem
              (adminsystemSaveRes.body.name).should.equal(adminsystem.name);
              should.exist(adminsystemSaveRes.body.user);
              should.equal(adminsystemSaveRes.body.user._id, orphanId);

              // force the Adminsystem to have an orphaned user reference
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

                    // Get the Adminsystem
                    agent.get('/api/adminsystems/' + adminsystemSaveRes.body._id)
                      .expect(200)
                      .end(function (adminsystemInfoErr, adminsystemInfoRes) {
                        // Handle Adminsystem error
                        if (adminsystemInfoErr) {
                          return done(adminsystemInfoErr);
                        }

                        // Set assertions
                        (adminsystemInfoRes.body._id).should.equal(adminsystemSaveRes.body._id);
                        (adminsystemInfoRes.body.name).should.equal(adminsystem.name);
                        should.equal(adminsystemInfoRes.body.user, undefined);

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
      Adminsystem.remove().exec(done);
    });
  });
});
