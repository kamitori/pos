'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Appintegration = mongoose.model('Appintegration'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app,
  agent,
  credentials,
  user,
  appintegration;

/**
 * Appintegration routes tests
 */
describe('Appintegration CRUD tests', function () {

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

    // Save a user to the test db and create new Appintegration
    user.save(function () {
      appintegration = {
        name: 'Appintegration name'
      };

      done();
    });
  });

  it('should be able to save a Appintegration if logged in', function (done) {
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

        // Save a new Appintegration
        agent.post('/api/appintegrations')
          .send(appintegration)
          .expect(200)
          .end(function (appintegrationSaveErr, appintegrationSaveRes) {
            // Handle Appintegration save error
            if (appintegrationSaveErr) {
              return done(appintegrationSaveErr);
            }

            // Get a list of Appintegrations
            agent.get('/api/appintegrations')
              .end(function (appintegrationsGetErr, appintegrationsGetRes) {
                // Handle Appintegrations save error
                if (appintegrationsGetErr) {
                  return done(appintegrationsGetErr);
                }

                // Get Appintegrations list
                var appintegrations = appintegrationsGetRes.body;

                // Set assertions
                (appintegrations[0].user._id).should.equal(userId);
                (appintegrations[0].name).should.match('Appintegration name');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an Appintegration if not logged in', function (done) {
    agent.post('/api/appintegrations')
      .send(appintegration)
      .expect(403)
      .end(function (appintegrationSaveErr, appintegrationSaveRes) {
        // Call the assertion callback
        done(appintegrationSaveErr);
      });
  });

  it('should not be able to save an Appintegration if no name is provided', function (done) {
    // Invalidate name field
    appintegration.name = '';

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

        // Save a new Appintegration
        agent.post('/api/appintegrations')
          .send(appintegration)
          .expect(400)
          .end(function (appintegrationSaveErr, appintegrationSaveRes) {
            // Set message assertion
            (appintegrationSaveRes.body.message).should.match('Please fill Appintegration name');

            // Handle Appintegration save error
            done(appintegrationSaveErr);
          });
      });
  });

  it('should be able to update an Appintegration if signed in', function (done) {
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

        // Save a new Appintegration
        agent.post('/api/appintegrations')
          .send(appintegration)
          .expect(200)
          .end(function (appintegrationSaveErr, appintegrationSaveRes) {
            // Handle Appintegration save error
            if (appintegrationSaveErr) {
              return done(appintegrationSaveErr);
            }

            // Update Appintegration name
            appintegration.name = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing Appintegration
            agent.put('/api/appintegrations/' + appintegrationSaveRes.body._id)
              .send(appintegration)
              .expect(200)
              .end(function (appintegrationUpdateErr, appintegrationUpdateRes) {
                // Handle Appintegration update error
                if (appintegrationUpdateErr) {
                  return done(appintegrationUpdateErr);
                }

                // Set assertions
                (appintegrationUpdateRes.body._id).should.equal(appintegrationSaveRes.body._id);
                (appintegrationUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of Appintegrations if not signed in', function (done) {
    // Create new Appintegration model instance
    var appintegrationObj = new Appintegration(appintegration);

    // Save the appintegration
    appintegrationObj.save(function () {
      // Request Appintegrations
      request(app).get('/api/appintegrations')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single Appintegration if not signed in', function (done) {
    // Create new Appintegration model instance
    var appintegrationObj = new Appintegration(appintegration);

    // Save the Appintegration
    appintegrationObj.save(function () {
      request(app).get('/api/appintegrations/' + appintegrationObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('name', appintegration.name);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single Appintegration with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/appintegrations/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Appintegration is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single Appintegration which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent Appintegration
    request(app).get('/api/appintegrations/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No Appintegration with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an Appintegration if signed in', function (done) {
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

        // Save a new Appintegration
        agent.post('/api/appintegrations')
          .send(appintegration)
          .expect(200)
          .end(function (appintegrationSaveErr, appintegrationSaveRes) {
            // Handle Appintegration save error
            if (appintegrationSaveErr) {
              return done(appintegrationSaveErr);
            }

            // Delete an existing Appintegration
            agent.delete('/api/appintegrations/' + appintegrationSaveRes.body._id)
              .send(appintegration)
              .expect(200)
              .end(function (appintegrationDeleteErr, appintegrationDeleteRes) {
                // Handle appintegration error error
                if (appintegrationDeleteErr) {
                  return done(appintegrationDeleteErr);
                }

                // Set assertions
                (appintegrationDeleteRes.body._id).should.equal(appintegrationSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an Appintegration if not signed in', function (done) {
    // Set Appintegration user
    appintegration.user = user;

    // Create new Appintegration model instance
    var appintegrationObj = new Appintegration(appintegration);

    // Save the Appintegration
    appintegrationObj.save(function () {
      // Try deleting Appintegration
      request(app).delete('/api/appintegrations/' + appintegrationObj._id)
        .expect(403)
        .end(function (appintegrationDeleteErr, appintegrationDeleteRes) {
          // Set message assertion
          (appintegrationDeleteRes.body.message).should.match('User is not authorized');

          // Handle Appintegration error error
          done(appintegrationDeleteErr);
        });

    });
  });

  it('should be able to get a single Appintegration that has an orphaned user reference', function (done) {
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

          // Save a new Appintegration
          agent.post('/api/appintegrations')
            .send(appintegration)
            .expect(200)
            .end(function (appintegrationSaveErr, appintegrationSaveRes) {
              // Handle Appintegration save error
              if (appintegrationSaveErr) {
                return done(appintegrationSaveErr);
              }

              // Set assertions on new Appintegration
              (appintegrationSaveRes.body.name).should.equal(appintegration.name);
              should.exist(appintegrationSaveRes.body.user);
              should.equal(appintegrationSaveRes.body.user._id, orphanId);

              // force the Appintegration to have an orphaned user reference
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

                    // Get the Appintegration
                    agent.get('/api/appintegrations/' + appintegrationSaveRes.body._id)
                      .expect(200)
                      .end(function (appintegrationInfoErr, appintegrationInfoRes) {
                        // Handle Appintegration error
                        if (appintegrationInfoErr) {
                          return done(appintegrationInfoErr);
                        }

                        // Set assertions
                        (appintegrationInfoRes.body._id).should.equal(appintegrationSaveRes.body._id);
                        (appintegrationInfoRes.body.name).should.equal(appintegration.name);
                        should.equal(appintegrationInfoRes.body.user, undefined);

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
      Appintegration.remove().exec(done);
    });
  });
});
