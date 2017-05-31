'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Adminservice = mongoose.model('Adminservice'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app,
  agent,
  credentials,
  user,
  adminservice;

/**
 * Adminservice routes tests
 */
describe('Adminservice CRUD tests', function () {

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

    // Save a user to the test db and create new Adminservice
    user.save(function () {
      adminservice = {
        name: 'Adminservice name'
      };

      done();
    });
  });

  it('should be able to save a Adminservice if logged in', function (done) {
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

        // Save a new Adminservice
        agent.post('/api/adminservices')
          .send(adminservice)
          .expect(200)
          .end(function (adminserviceSaveErr, adminserviceSaveRes) {
            // Handle Adminservice save error
            if (adminserviceSaveErr) {
              return done(adminserviceSaveErr);
            }

            // Get a list of Adminservices
            agent.get('/api/adminservices')
              .end(function (adminservicesGetErr, adminservicesGetRes) {
                // Handle Adminservices save error
                if (adminservicesGetErr) {
                  return done(adminservicesGetErr);
                }

                // Get Adminservices list
                var adminservices = adminservicesGetRes.body;

                // Set assertions
                (adminservices[0].user._id).should.equal(userId);
                (adminservices[0].name).should.match('Adminservice name');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an Adminservice if not logged in', function (done) {
    agent.post('/api/adminservices')
      .send(adminservice)
      .expect(403)
      .end(function (adminserviceSaveErr, adminserviceSaveRes) {
        // Call the assertion callback
        done(adminserviceSaveErr);
      });
  });

  it('should not be able to save an Adminservice if no name is provided', function (done) {
    // Invalidate name field
    adminservice.name = '';

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

        // Save a new Adminservice
        agent.post('/api/adminservices')
          .send(adminservice)
          .expect(400)
          .end(function (adminserviceSaveErr, adminserviceSaveRes) {
            // Set message assertion
            (adminserviceSaveRes.body.message).should.match('Please fill Adminservice name');

            // Handle Adminservice save error
            done(adminserviceSaveErr);
          });
      });
  });

  it('should be able to update an Adminservice if signed in', function (done) {
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

        // Save a new Adminservice
        agent.post('/api/adminservices')
          .send(adminservice)
          .expect(200)
          .end(function (adminserviceSaveErr, adminserviceSaveRes) {
            // Handle Adminservice save error
            if (adminserviceSaveErr) {
              return done(adminserviceSaveErr);
            }

            // Update Adminservice name
            adminservice.name = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing Adminservice
            agent.put('/api/adminservices/' + adminserviceSaveRes.body._id)
              .send(adminservice)
              .expect(200)
              .end(function (adminserviceUpdateErr, adminserviceUpdateRes) {
                // Handle Adminservice update error
                if (adminserviceUpdateErr) {
                  return done(adminserviceUpdateErr);
                }

                // Set assertions
                (adminserviceUpdateRes.body._id).should.equal(adminserviceSaveRes.body._id);
                (adminserviceUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of Adminservices if not signed in', function (done) {
    // Create new Adminservice model instance
    var adminserviceObj = new Adminservice(adminservice);

    // Save the adminservice
    adminserviceObj.save(function () {
      // Request Adminservices
      request(app).get('/api/adminservices')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single Adminservice if not signed in', function (done) {
    // Create new Adminservice model instance
    var adminserviceObj = new Adminservice(adminservice);

    // Save the Adminservice
    adminserviceObj.save(function () {
      request(app).get('/api/adminservices/' + adminserviceObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('name', adminservice.name);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single Adminservice with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/adminservices/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Adminservice is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single Adminservice which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent Adminservice
    request(app).get('/api/adminservices/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No Adminservice with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an Adminservice if signed in', function (done) {
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

        // Save a new Adminservice
        agent.post('/api/adminservices')
          .send(adminservice)
          .expect(200)
          .end(function (adminserviceSaveErr, adminserviceSaveRes) {
            // Handle Adminservice save error
            if (adminserviceSaveErr) {
              return done(adminserviceSaveErr);
            }

            // Delete an existing Adminservice
            agent.delete('/api/adminservices/' + adminserviceSaveRes.body._id)
              .send(adminservice)
              .expect(200)
              .end(function (adminserviceDeleteErr, adminserviceDeleteRes) {
                // Handle adminservice error error
                if (adminserviceDeleteErr) {
                  return done(adminserviceDeleteErr);
                }

                // Set assertions
                (adminserviceDeleteRes.body._id).should.equal(adminserviceSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an Adminservice if not signed in', function (done) {
    // Set Adminservice user
    adminservice.user = user;

    // Create new Adminservice model instance
    var adminserviceObj = new Adminservice(adminservice);

    // Save the Adminservice
    adminserviceObj.save(function () {
      // Try deleting Adminservice
      request(app).delete('/api/adminservices/' + adminserviceObj._id)
        .expect(403)
        .end(function (adminserviceDeleteErr, adminserviceDeleteRes) {
          // Set message assertion
          (adminserviceDeleteRes.body.message).should.match('User is not authorized');

          // Handle Adminservice error error
          done(adminserviceDeleteErr);
        });

    });
  });

  it('should be able to get a single Adminservice that has an orphaned user reference', function (done) {
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

          // Save a new Adminservice
          agent.post('/api/adminservices')
            .send(adminservice)
            .expect(200)
            .end(function (adminserviceSaveErr, adminserviceSaveRes) {
              // Handle Adminservice save error
              if (adminserviceSaveErr) {
                return done(adminserviceSaveErr);
              }

              // Set assertions on new Adminservice
              (adminserviceSaveRes.body.name).should.equal(adminservice.name);
              should.exist(adminserviceSaveRes.body.user);
              should.equal(adminserviceSaveRes.body.user._id, orphanId);

              // force the Adminservice to have an orphaned user reference
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

                    // Get the Adminservice
                    agent.get('/api/adminservices/' + adminserviceSaveRes.body._id)
                      .expect(200)
                      .end(function (adminserviceInfoErr, adminserviceInfoRes) {
                        // Handle Adminservice error
                        if (adminserviceInfoErr) {
                          return done(adminserviceInfoErr);
                        }

                        // Set assertions
                        (adminserviceInfoRes.body._id).should.equal(adminserviceSaveRes.body._id);
                        (adminserviceInfoRes.body.name).should.equal(adminservice.name);
                        should.equal(adminserviceInfoRes.body.user, undefined);

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
      Adminservice.remove().exec(done);
    });
  });
});
