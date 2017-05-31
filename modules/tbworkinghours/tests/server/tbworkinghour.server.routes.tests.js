'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Tbworkinghour = mongoose.model('Tbworkinghour'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app,
  agent,
  credentials,
  user,
  tbworkinghour;

/**
 * Tbworkinghour routes tests
 */
describe('Tbworkinghour CRUD tests', function () {

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
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'test@test.com',
      username: credentials.username,
      password: credentials.password,
      provider: 'local'
    });

    // Save a user to the test db and create new Tbworkinghour
    user.save(function () {
      tbworkinghour = {
        name: 'Tbworkinghour name'
      };

      done();
    });
  });

  it('should be able to save a Tbworkinghour if logged in', function (done) {
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

        // Save a new Tbworkinghour
        agent.post('/api/tbworkinghours')
          .send(tbworkinghour)
          .expect(200)
          .end(function (tbworkinghourSaveErr, tbworkinghourSaveRes) {
            // Handle Tbworkinghour save error
            if (tbworkinghourSaveErr) {
              return done(tbworkinghourSaveErr);
            }

            // Get a list of Tbworkinghours
            agent.get('/api/tbworkinghours')
              .end(function (tbworkinghoursGetErr, tbworkinghoursGetRes) {
                // Handle Tbworkinghours save error
                if (tbworkinghoursGetErr) {
                  return done(tbworkinghoursGetErr);
                }

                // Get Tbworkinghours list
                var tbworkinghours = tbworkinghoursGetRes.body;

                // Set assertions
                (tbworkinghours[0].user._id).should.equal(userId);
                (tbworkinghours[0].name).should.match('Tbworkinghour name');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an Tbworkinghour if not logged in', function (done) {
    agent.post('/api/tbworkinghours')
      .send(tbworkinghour)
      .expect(403)
      .end(function (tbworkinghourSaveErr, tbworkinghourSaveRes) {
        // Call the assertion callback
        done(tbworkinghourSaveErr);
      });
  });

  it('should not be able to save an Tbworkinghour if no name is provided', function (done) {
    // Invalidate name field
    tbworkinghour.name = '';

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

        // Save a new Tbworkinghour
        agent.post('/api/tbworkinghours')
          .send(tbworkinghour)
          .expect(400)
          .end(function (tbworkinghourSaveErr, tbworkinghourSaveRes) {
            // Set message assertion
            (tbworkinghourSaveRes.body.message).should.match('Please fill Tbworkinghour name');

            // Handle Tbworkinghour save error
            done(tbworkinghourSaveErr);
          });
      });
  });

  it('should be able to update an Tbworkinghour if signed in', function (done) {
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

        // Save a new Tbworkinghour
        agent.post('/api/tbworkinghours')
          .send(tbworkinghour)
          .expect(200)
          .end(function (tbworkinghourSaveErr, tbworkinghourSaveRes) {
            // Handle Tbworkinghour save error
            if (tbworkinghourSaveErr) {
              return done(tbworkinghourSaveErr);
            }

            // Update Tbworkinghour name
            tbworkinghour.name = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing Tbworkinghour
            agent.put('/api/tbworkinghours/' + tbworkinghourSaveRes.body._id)
              .send(tbworkinghour)
              .expect(200)
              .end(function (tbworkinghourUpdateErr, tbworkinghourUpdateRes) {
                // Handle Tbworkinghour update error
                if (tbworkinghourUpdateErr) {
                  return done(tbworkinghourUpdateErr);
                }

                // Set assertions
                (tbworkinghourUpdateRes.body._id).should.equal(tbworkinghourSaveRes.body._id);
                (tbworkinghourUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of Tbworkinghours if not signed in', function (done) {
    // Create new Tbworkinghour model instance
    var tbworkinghourObj = new Tbworkinghour(tbworkinghour);

    // Save the tbworkinghour
    tbworkinghourObj.save(function () {
      // Request Tbworkinghours
      request(app).get('/api/tbworkinghours')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single Tbworkinghour if not signed in', function (done) {
    // Create new Tbworkinghour model instance
    var tbworkinghourObj = new Tbworkinghour(tbworkinghour);

    // Save the Tbworkinghour
    tbworkinghourObj.save(function () {
      request(app).get('/api/tbworkinghours/' + tbworkinghourObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('name', tbworkinghour.name);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single Tbworkinghour with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/tbworkinghours/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Tbworkinghour is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single Tbworkinghour which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent Tbworkinghour
    request(app).get('/api/tbworkinghours/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No Tbworkinghour with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an Tbworkinghour if signed in', function (done) {
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

        // Save a new Tbworkinghour
        agent.post('/api/tbworkinghours')
          .send(tbworkinghour)
          .expect(200)
          .end(function (tbworkinghourSaveErr, tbworkinghourSaveRes) {
            // Handle Tbworkinghour save error
            if (tbworkinghourSaveErr) {
              return done(tbworkinghourSaveErr);
            }

            // Delete an existing Tbworkinghour
            agent.delete('/api/tbworkinghours/' + tbworkinghourSaveRes.body._id)
              .send(tbworkinghour)
              .expect(200)
              .end(function (tbworkinghourDeleteErr, tbworkinghourDeleteRes) {
                // Handle tbworkinghour error error
                if (tbworkinghourDeleteErr) {
                  return done(tbworkinghourDeleteErr);
                }

                // Set assertions
                (tbworkinghourDeleteRes.body._id).should.equal(tbworkinghourSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an Tbworkinghour if not signed in', function (done) {
    // Set Tbworkinghour user
    tbworkinghour.user = user;

    // Create new Tbworkinghour model instance
    var tbworkinghourObj = new Tbworkinghour(tbworkinghour);

    // Save the Tbworkinghour
    tbworkinghourObj.save(function () {
      // Try deleting Tbworkinghour
      request(app).delete('/api/tbworkinghours/' + tbworkinghourObj._id)
        .expect(403)
        .end(function (tbworkinghourDeleteErr, tbworkinghourDeleteRes) {
          // Set message assertion
          (tbworkinghourDeleteRes.body.message).should.match('User is not authorized');

          // Handle Tbworkinghour error error
          done(tbworkinghourDeleteErr);
        });

    });
  });

  it('should be able to get a single Tbworkinghour that has an orphaned user reference', function (done) {
    // Create orphan user creds
    var _creds = {
      username: 'orphan',
      password: 'M3@n.jsI$Aw3$0m3'
    };

    // Create orphan user
    var _orphan = new User({
      firstName: 'Full',
      lastName: 'Name',
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

          // Save a new Tbworkinghour
          agent.post('/api/tbworkinghours')
            .send(tbworkinghour)
            .expect(200)
            .end(function (tbworkinghourSaveErr, tbworkinghourSaveRes) {
              // Handle Tbworkinghour save error
              if (tbworkinghourSaveErr) {
                return done(tbworkinghourSaveErr);
              }

              // Set assertions on new Tbworkinghour
              (tbworkinghourSaveRes.body.name).should.equal(tbworkinghour.name);
              should.exist(tbworkinghourSaveRes.body.user);
              should.equal(tbworkinghourSaveRes.body.user._id, orphanId);

              // force the Tbworkinghour to have an orphaned user reference
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

                    // Get the Tbworkinghour
                    agent.get('/api/tbworkinghours/' + tbworkinghourSaveRes.body._id)
                      .expect(200)
                      .end(function (tbworkinghourInfoErr, tbworkinghourInfoRes) {
                        // Handle Tbworkinghour error
                        if (tbworkinghourInfoErr) {
                          return done(tbworkinghourInfoErr);
                        }

                        // Set assertions
                        (tbworkinghourInfoRes.body._id).should.equal(tbworkinghourSaveRes.body._id);
                        (tbworkinghourInfoRes.body.name).should.equal(tbworkinghour.name);
                        should.equal(tbworkinghourInfoRes.body.user, undefined);

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
      Tbworkinghour.remove().exec(done);
    });
  });
});
