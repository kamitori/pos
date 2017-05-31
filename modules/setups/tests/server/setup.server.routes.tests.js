'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Setup = mongoose.model('Setup'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app,
  agent,
  credentials,
  user,
  setup;

/**
 * Setup routes tests
 */
describe('Setup CRUD tests', function () {

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

    // Save a user to the test db and create new Setup
    user.save(function () {
      setup = {
        name: 'Setup name'
      };

      done();
    });
  });

  it('should be able to save a Setup if logged in', function (done) {
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

        // Save a new Setup
        agent.post('/api/setups')
          .send(setup)
          .expect(200)
          .end(function (setupSaveErr, setupSaveRes) {
            // Handle Setup save error
            if (setupSaveErr) {
              return done(setupSaveErr);
            }

            // Get a list of Setups
            agent.get('/api/setups')
              .end(function (setupsGetErr, setupsGetRes) {
                // Handle Setups save error
                if (setupsGetErr) {
                  return done(setupsGetErr);
                }

                // Get Setups list
                var setups = setupsGetRes.body;

                // Set assertions
                (setups[0].user._id).should.equal(userId);
                (setups[0].name).should.match('Setup name');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an Setup if not logged in', function (done) {
    agent.post('/api/setups')
      .send(setup)
      .expect(403)
      .end(function (setupSaveErr, setupSaveRes) {
        // Call the assertion callback
        done(setupSaveErr);
      });
  });

  it('should not be able to save an Setup if no name is provided', function (done) {
    // Invalidate name field
    setup.name = '';

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

        // Save a new Setup
        agent.post('/api/setups')
          .send(setup)
          .expect(400)
          .end(function (setupSaveErr, setupSaveRes) {
            // Set message assertion
            (setupSaveRes.body.message).should.match('Please fill Setup name');

            // Handle Setup save error
            done(setupSaveErr);
          });
      });
  });

  it('should be able to update an Setup if signed in', function (done) {
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

        // Save a new Setup
        agent.post('/api/setups')
          .send(setup)
          .expect(200)
          .end(function (setupSaveErr, setupSaveRes) {
            // Handle Setup save error
            if (setupSaveErr) {
              return done(setupSaveErr);
            }

            // Update Setup name
            setup.name = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing Setup
            agent.put('/api/setups/' + setupSaveRes.body._id)
              .send(setup)
              .expect(200)
              .end(function (setupUpdateErr, setupUpdateRes) {
                // Handle Setup update error
                if (setupUpdateErr) {
                  return done(setupUpdateErr);
                }

                // Set assertions
                (setupUpdateRes.body._id).should.equal(setupSaveRes.body._id);
                (setupUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of Setups if not signed in', function (done) {
    // Create new Setup model instance
    var setupObj = new Setup(setup);

    // Save the setup
    setupObj.save(function () {
      // Request Setups
      request(app).get('/api/setups')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single Setup if not signed in', function (done) {
    // Create new Setup model instance
    var setupObj = new Setup(setup);

    // Save the Setup
    setupObj.save(function () {
      request(app).get('/api/setups/' + setupObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('name', setup.name);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single Setup with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/setups/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Setup is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single Setup which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent Setup
    request(app).get('/api/setups/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No Setup with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an Setup if signed in', function (done) {
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

        // Save a new Setup
        agent.post('/api/setups')
          .send(setup)
          .expect(200)
          .end(function (setupSaveErr, setupSaveRes) {
            // Handle Setup save error
            if (setupSaveErr) {
              return done(setupSaveErr);
            }

            // Delete an existing Setup
            agent.delete('/api/setups/' + setupSaveRes.body._id)
              .send(setup)
              .expect(200)
              .end(function (setupDeleteErr, setupDeleteRes) {
                // Handle setup error error
                if (setupDeleteErr) {
                  return done(setupDeleteErr);
                }

                // Set assertions
                (setupDeleteRes.body._id).should.equal(setupSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an Setup if not signed in', function (done) {
    // Set Setup user
    setup.user = user;

    // Create new Setup model instance
    var setupObj = new Setup(setup);

    // Save the Setup
    setupObj.save(function () {
      // Try deleting Setup
      request(app).delete('/api/setups/' + setupObj._id)
        .expect(403)
        .end(function (setupDeleteErr, setupDeleteRes) {
          // Set message assertion
          (setupDeleteRes.body.message).should.match('User is not authorized');

          // Handle Setup error error
          done(setupDeleteErr);
        });

    });
  });

  it('should be able to get a single Setup that has an orphaned user reference', function (done) {
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

          // Save a new Setup
          agent.post('/api/setups')
            .send(setup)
            .expect(200)
            .end(function (setupSaveErr, setupSaveRes) {
              // Handle Setup save error
              if (setupSaveErr) {
                return done(setupSaveErr);
              }

              // Set assertions on new Setup
              (setupSaveRes.body.name).should.equal(setup.name);
              should.exist(setupSaveRes.body.user);
              should.equal(setupSaveRes.body.user._id, orphanId);

              // force the Setup to have an orphaned user reference
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

                    // Get the Setup
                    agent.get('/api/setups/' + setupSaveRes.body._id)
                      .expect(200)
                      .end(function (setupInfoErr, setupInfoRes) {
                        // Handle Setup error
                        if (setupInfoErr) {
                          return done(setupInfoErr);
                        }

                        // Set assertions
                        (setupInfoRes.body._id).should.equal(setupSaveRes.body._id);
                        (setupInfoRes.body.name).should.equal(setup.name);
                        should.equal(setupInfoRes.body.user, undefined);

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
      Setup.remove().exec(done);
    });
  });
});
