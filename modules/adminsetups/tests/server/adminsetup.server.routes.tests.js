'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Adminsetup = mongoose.model('Adminsetup'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app,
  agent,
  credentials,
  user,
  adminsetup;

/**
 * Adminsetup routes tests
 */
describe('Adminsetup CRUD tests', function () {

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

    // Save a user to the test db and create new Adminsetup
    user.save(function () {
      adminsetup = {
        name: 'Adminsetup name'
      };

      done();
    });
  });

  it('should be able to save a Adminsetup if logged in', function (done) {
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

        // Save a new Adminsetup
        agent.post('/api/adminsetups')
          .send(adminsetup)
          .expect(200)
          .end(function (adminsetupSaveErr, adminsetupSaveRes) {
            // Handle Adminsetup save error
            if (adminsetupSaveErr) {
              return done(adminsetupSaveErr);
            }

            // Get a list of Adminsetups
            agent.get('/api/adminsetups')
              .end(function (adminsetupsGetErr, adminsetupsGetRes) {
                // Handle Adminsetups save error
                if (adminsetupsGetErr) {
                  return done(adminsetupsGetErr);
                }

                // Get Adminsetups list
                var adminsetups = adminsetupsGetRes.body;

                // Set assertions
                (adminsetups[0].user._id).should.equal(userId);
                (adminsetups[0].name).should.match('Adminsetup name');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an Adminsetup if not logged in', function (done) {
    agent.post('/api/adminsetups')
      .send(adminsetup)
      .expect(403)
      .end(function (adminsetupSaveErr, adminsetupSaveRes) {
        // Call the assertion callback
        done(adminsetupSaveErr);
      });
  });

  it('should not be able to save an Adminsetup if no name is provided', function (done) {
    // Invalidate name field
    adminsetup.name = '';

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

        // Save a new Adminsetup
        agent.post('/api/adminsetups')
          .send(adminsetup)
          .expect(400)
          .end(function (adminsetupSaveErr, adminsetupSaveRes) {
            // Set message assertion
            (adminsetupSaveRes.body.message).should.match('Please fill Adminsetup name');

            // Handle Adminsetup save error
            done(adminsetupSaveErr);
          });
      });
  });

  it('should be able to update an Adminsetup if signed in', function (done) {
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

        // Save a new Adminsetup
        agent.post('/api/adminsetups')
          .send(adminsetup)
          .expect(200)
          .end(function (adminsetupSaveErr, adminsetupSaveRes) {
            // Handle Adminsetup save error
            if (adminsetupSaveErr) {
              return done(adminsetupSaveErr);
            }

            // Update Adminsetup name
            adminsetup.name = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing Adminsetup
            agent.put('/api/adminsetups/' + adminsetupSaveRes.body._id)
              .send(adminsetup)
              .expect(200)
              .end(function (adminsetupUpdateErr, adminsetupUpdateRes) {
                // Handle Adminsetup update error
                if (adminsetupUpdateErr) {
                  return done(adminsetupUpdateErr);
                }

                // Set assertions
                (adminsetupUpdateRes.body._id).should.equal(adminsetupSaveRes.body._id);
                (adminsetupUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of Adminsetups if not signed in', function (done) {
    // Create new Adminsetup model instance
    var adminsetupObj = new Adminsetup(adminsetup);

    // Save the adminsetup
    adminsetupObj.save(function () {
      // Request Adminsetups
      request(app).get('/api/adminsetups')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single Adminsetup if not signed in', function (done) {
    // Create new Adminsetup model instance
    var adminsetupObj = new Adminsetup(adminsetup);

    // Save the Adminsetup
    adminsetupObj.save(function () {
      request(app).get('/api/adminsetups/' + adminsetupObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('name', adminsetup.name);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single Adminsetup with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/adminsetups/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Adminsetup is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single Adminsetup which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent Adminsetup
    request(app).get('/api/adminsetups/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No Adminsetup with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an Adminsetup if signed in', function (done) {
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

        // Save a new Adminsetup
        agent.post('/api/adminsetups')
          .send(adminsetup)
          .expect(200)
          .end(function (adminsetupSaveErr, adminsetupSaveRes) {
            // Handle Adminsetup save error
            if (adminsetupSaveErr) {
              return done(adminsetupSaveErr);
            }

            // Delete an existing Adminsetup
            agent.delete('/api/adminsetups/' + adminsetupSaveRes.body._id)
              .send(adminsetup)
              .expect(200)
              .end(function (adminsetupDeleteErr, adminsetupDeleteRes) {
                // Handle adminsetup error error
                if (adminsetupDeleteErr) {
                  return done(adminsetupDeleteErr);
                }

                // Set assertions
                (adminsetupDeleteRes.body._id).should.equal(adminsetupSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an Adminsetup if not signed in', function (done) {
    // Set Adminsetup user
    adminsetup.user = user;

    // Create new Adminsetup model instance
    var adminsetupObj = new Adminsetup(adminsetup);

    // Save the Adminsetup
    adminsetupObj.save(function () {
      // Try deleting Adminsetup
      request(app).delete('/api/adminsetups/' + adminsetupObj._id)
        .expect(403)
        .end(function (adminsetupDeleteErr, adminsetupDeleteRes) {
          // Set message assertion
          (adminsetupDeleteRes.body.message).should.match('User is not authorized');

          // Handle Adminsetup error error
          done(adminsetupDeleteErr);
        });

    });
  });

  it('should be able to get a single Adminsetup that has an orphaned user reference', function (done) {
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

          // Save a new Adminsetup
          agent.post('/api/adminsetups')
            .send(adminsetup)
            .expect(200)
            .end(function (adminsetupSaveErr, adminsetupSaveRes) {
              // Handle Adminsetup save error
              if (adminsetupSaveErr) {
                return done(adminsetupSaveErr);
              }

              // Set assertions on new Adminsetup
              (adminsetupSaveRes.body.name).should.equal(adminsetup.name);
              should.exist(adminsetupSaveRes.body.user);
              should.equal(adminsetupSaveRes.body.user._id, orphanId);

              // force the Adminsetup to have an orphaned user reference
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

                    // Get the Adminsetup
                    agent.get('/api/adminsetups/' + adminsetupSaveRes.body._id)
                      .expect(200)
                      .end(function (adminsetupInfoErr, adminsetupInfoRes) {
                        // Handle Adminsetup error
                        if (adminsetupInfoErr) {
                          return done(adminsetupInfoErr);
                        }

                        // Set assertions
                        (adminsetupInfoRes.body._id).should.equal(adminsetupSaveRes.body._id);
                        (adminsetupInfoRes.body.name).should.equal(adminsetup.name);
                        should.equal(adminsetupInfoRes.body.user, undefined);

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
      Adminsetup.remove().exec(done);
    });
  });
});
