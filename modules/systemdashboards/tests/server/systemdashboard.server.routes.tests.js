'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Systemdashboard = mongoose.model('Systemdashboard'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app,
  agent,
  credentials,
  user,
  systemdashboard;

/**
 * Systemdashboard routes tests
 */
describe('Systemdashboard CRUD tests', function () {

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

    // Save a user to the test db and create new Systemdashboard
    user.save(function () {
      systemdashboard = {
        name: 'Systemdashboard name'
      };

      done();
    });
  });

  it('should be able to save a Systemdashboard if logged in', function (done) {
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

        // Save a new Systemdashboard
        agent.post('/api/systemdashboards')
          .send(systemdashboard)
          .expect(200)
          .end(function (systemdashboardSaveErr, systemdashboardSaveRes) {
            // Handle Systemdashboard save error
            if (systemdashboardSaveErr) {
              return done(systemdashboardSaveErr);
            }

            // Get a list of Systemdashboards
            agent.get('/api/systemdashboards')
              .end(function (systemdashboardsGetErr, systemdashboardsGetRes) {
                // Handle Systemdashboards save error
                if (systemdashboardsGetErr) {
                  return done(systemdashboardsGetErr);
                }

                // Get Systemdashboards list
                var systemdashboards = systemdashboardsGetRes.body;

                // Set assertions
                (systemdashboards[0].user._id).should.equal(userId);
                (systemdashboards[0].name).should.match('Systemdashboard name');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an Systemdashboard if not logged in', function (done) {
    agent.post('/api/systemdashboards')
      .send(systemdashboard)
      .expect(403)
      .end(function (systemdashboardSaveErr, systemdashboardSaveRes) {
        // Call the assertion callback
        done(systemdashboardSaveErr);
      });
  });

  it('should not be able to save an Systemdashboard if no name is provided', function (done) {
    // Invalidate name field
    systemdashboard.name = '';

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

        // Save a new Systemdashboard
        agent.post('/api/systemdashboards')
          .send(systemdashboard)
          .expect(400)
          .end(function (systemdashboardSaveErr, systemdashboardSaveRes) {
            // Set message assertion
            (systemdashboardSaveRes.body.message).should.match('Please fill Systemdashboard name');

            // Handle Systemdashboard save error
            done(systemdashboardSaveErr);
          });
      });
  });

  it('should be able to update an Systemdashboard if signed in', function (done) {
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

        // Save a new Systemdashboard
        agent.post('/api/systemdashboards')
          .send(systemdashboard)
          .expect(200)
          .end(function (systemdashboardSaveErr, systemdashboardSaveRes) {
            // Handle Systemdashboard save error
            if (systemdashboardSaveErr) {
              return done(systemdashboardSaveErr);
            }

            // Update Systemdashboard name
            systemdashboard.name = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing Systemdashboard
            agent.put('/api/systemdashboards/' + systemdashboardSaveRes.body._id)
              .send(systemdashboard)
              .expect(200)
              .end(function (systemdashboardUpdateErr, systemdashboardUpdateRes) {
                // Handle Systemdashboard update error
                if (systemdashboardUpdateErr) {
                  return done(systemdashboardUpdateErr);
                }

                // Set assertions
                (systemdashboardUpdateRes.body._id).should.equal(systemdashboardSaveRes.body._id);
                (systemdashboardUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of Systemdashboards if not signed in', function (done) {
    // Create new Systemdashboard model instance
    var systemdashboardObj = new Systemdashboard(systemdashboard);

    // Save the systemdashboard
    systemdashboardObj.save(function () {
      // Request Systemdashboards
      request(app).get('/api/systemdashboards')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single Systemdashboard if not signed in', function (done) {
    // Create new Systemdashboard model instance
    var systemdashboardObj = new Systemdashboard(systemdashboard);

    // Save the Systemdashboard
    systemdashboardObj.save(function () {
      request(app).get('/api/systemdashboards/' + systemdashboardObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('name', systemdashboard.name);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single Systemdashboard with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/systemdashboards/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Systemdashboard is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single Systemdashboard which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent Systemdashboard
    request(app).get('/api/systemdashboards/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No Systemdashboard with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an Systemdashboard if signed in', function (done) {
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

        // Save a new Systemdashboard
        agent.post('/api/systemdashboards')
          .send(systemdashboard)
          .expect(200)
          .end(function (systemdashboardSaveErr, systemdashboardSaveRes) {
            // Handle Systemdashboard save error
            if (systemdashboardSaveErr) {
              return done(systemdashboardSaveErr);
            }

            // Delete an existing Systemdashboard
            agent.delete('/api/systemdashboards/' + systemdashboardSaveRes.body._id)
              .send(systemdashboard)
              .expect(200)
              .end(function (systemdashboardDeleteErr, systemdashboardDeleteRes) {
                // Handle systemdashboard error error
                if (systemdashboardDeleteErr) {
                  return done(systemdashboardDeleteErr);
                }

                // Set assertions
                (systemdashboardDeleteRes.body._id).should.equal(systemdashboardSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an Systemdashboard if not signed in', function (done) {
    // Set Systemdashboard user
    systemdashboard.user = user;

    // Create new Systemdashboard model instance
    var systemdashboardObj = new Systemdashboard(systemdashboard);

    // Save the Systemdashboard
    systemdashboardObj.save(function () {
      // Try deleting Systemdashboard
      request(app).delete('/api/systemdashboards/' + systemdashboardObj._id)
        .expect(403)
        .end(function (systemdashboardDeleteErr, systemdashboardDeleteRes) {
          // Set message assertion
          (systemdashboardDeleteRes.body.message).should.match('User is not authorized');

          // Handle Systemdashboard error error
          done(systemdashboardDeleteErr);
        });

    });
  });

  it('should be able to get a single Systemdashboard that has an orphaned user reference', function (done) {
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

          // Save a new Systemdashboard
          agent.post('/api/systemdashboards')
            .send(systemdashboard)
            .expect(200)
            .end(function (systemdashboardSaveErr, systemdashboardSaveRes) {
              // Handle Systemdashboard save error
              if (systemdashboardSaveErr) {
                return done(systemdashboardSaveErr);
              }

              // Set assertions on new Systemdashboard
              (systemdashboardSaveRes.body.name).should.equal(systemdashboard.name);
              should.exist(systemdashboardSaveRes.body.user);
              should.equal(systemdashboardSaveRes.body.user._id, orphanId);

              // force the Systemdashboard to have an orphaned user reference
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

                    // Get the Systemdashboard
                    agent.get('/api/systemdashboards/' + systemdashboardSaveRes.body._id)
                      .expect(200)
                      .end(function (systemdashboardInfoErr, systemdashboardInfoRes) {
                        // Handle Systemdashboard error
                        if (systemdashboardInfoErr) {
                          return done(systemdashboardInfoErr);
                        }

                        // Set assertions
                        (systemdashboardInfoRes.body._id).should.equal(systemdashboardSaveRes.body._id);
                        (systemdashboardInfoRes.body.name).should.equal(systemdashboard.name);
                        should.equal(systemdashboardInfoRes.body.user, undefined);

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
      Systemdashboard.remove().exec(done);
    });
  });
});
