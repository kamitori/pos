'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Timeoff = mongoose.model('Timeoff'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app,
  agent,
  credentials,
  user,
  timeoff;

/**
 * Timeoff routes tests
 */
describe('Timeoff CRUD tests', function () {

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

    // Save a user to the test db and create new Timeoff
    user.save(function () {
      timeoff = {
        name: 'Timeoff name'
      };

      done();
    });
  });

  it('should be able to save a Timeoff if logged in', function (done) {
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

        // Save a new Timeoff
        agent.post('/api/timeoffs')
          .send(timeoff)
          .expect(200)
          .end(function (timeoffSaveErr, timeoffSaveRes) {
            // Handle Timeoff save error
            if (timeoffSaveErr) {
              return done(timeoffSaveErr);
            }

            // Get a list of Timeoffs
            agent.get('/api/timeoffs')
              .end(function (timeoffsGetErr, timeoffsGetRes) {
                // Handle Timeoffs save error
                if (timeoffsGetErr) {
                  return done(timeoffsGetErr);
                }

                // Get Timeoffs list
                var timeoffs = timeoffsGetRes.body;

                // Set assertions
                (timeoffs[0].user._id).should.equal(userId);
                (timeoffs[0].name).should.match('Timeoff name');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an Timeoff if not logged in', function (done) {
    agent.post('/api/timeoffs')
      .send(timeoff)
      .expect(403)
      .end(function (timeoffSaveErr, timeoffSaveRes) {
        // Call the assertion callback
        done(timeoffSaveErr);
      });
  });

  it('should not be able to save an Timeoff if no name is provided', function (done) {
    // Invalidate name field
    timeoff.name = '';

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

        // Save a new Timeoff
        agent.post('/api/timeoffs')
          .send(timeoff)
          .expect(400)
          .end(function (timeoffSaveErr, timeoffSaveRes) {
            // Set message assertion
            (timeoffSaveRes.body.message).should.match('Please fill Timeoff name');

            // Handle Timeoff save error
            done(timeoffSaveErr);
          });
      });
  });

  it('should be able to update an Timeoff if signed in', function (done) {
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

        // Save a new Timeoff
        agent.post('/api/timeoffs')
          .send(timeoff)
          .expect(200)
          .end(function (timeoffSaveErr, timeoffSaveRes) {
            // Handle Timeoff save error
            if (timeoffSaveErr) {
              return done(timeoffSaveErr);
            }

            // Update Timeoff name
            timeoff.name = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing Timeoff
            agent.put('/api/timeoffs/' + timeoffSaveRes.body._id)
              .send(timeoff)
              .expect(200)
              .end(function (timeoffUpdateErr, timeoffUpdateRes) {
                // Handle Timeoff update error
                if (timeoffUpdateErr) {
                  return done(timeoffUpdateErr);
                }

                // Set assertions
                (timeoffUpdateRes.body._id).should.equal(timeoffSaveRes.body._id);
                (timeoffUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of Timeoffs if not signed in', function (done) {
    // Create new Timeoff model instance
    var timeoffObj = new Timeoff(timeoff);

    // Save the timeoff
    timeoffObj.save(function () {
      // Request Timeoffs
      request(app).get('/api/timeoffs')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single Timeoff if not signed in', function (done) {
    // Create new Timeoff model instance
    var timeoffObj = new Timeoff(timeoff);

    // Save the Timeoff
    timeoffObj.save(function () {
      request(app).get('/api/timeoffs/' + timeoffObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('name', timeoff.name);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single Timeoff with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/timeoffs/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Timeoff is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single Timeoff which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent Timeoff
    request(app).get('/api/timeoffs/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No Timeoff with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an Timeoff if signed in', function (done) {
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

        // Save a new Timeoff
        agent.post('/api/timeoffs')
          .send(timeoff)
          .expect(200)
          .end(function (timeoffSaveErr, timeoffSaveRes) {
            // Handle Timeoff save error
            if (timeoffSaveErr) {
              return done(timeoffSaveErr);
            }

            // Delete an existing Timeoff
            agent.delete('/api/timeoffs/' + timeoffSaveRes.body._id)
              .send(timeoff)
              .expect(200)
              .end(function (timeoffDeleteErr, timeoffDeleteRes) {
                // Handle timeoff error error
                if (timeoffDeleteErr) {
                  return done(timeoffDeleteErr);
                }

                // Set assertions
                (timeoffDeleteRes.body._id).should.equal(timeoffSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an Timeoff if not signed in', function (done) {
    // Set Timeoff user
    timeoff.user = user;

    // Create new Timeoff model instance
    var timeoffObj = new Timeoff(timeoff);

    // Save the Timeoff
    timeoffObj.save(function () {
      // Try deleting Timeoff
      request(app).delete('/api/timeoffs/' + timeoffObj._id)
        .expect(403)
        .end(function (timeoffDeleteErr, timeoffDeleteRes) {
          // Set message assertion
          (timeoffDeleteRes.body.message).should.match('User is not authorized');

          // Handle Timeoff error error
          done(timeoffDeleteErr);
        });

    });
  });

  it('should be able to get a single Timeoff that has an orphaned user reference', function (done) {
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

          // Save a new Timeoff
          agent.post('/api/timeoffs')
            .send(timeoff)
            .expect(200)
            .end(function (timeoffSaveErr, timeoffSaveRes) {
              // Handle Timeoff save error
              if (timeoffSaveErr) {
                return done(timeoffSaveErr);
              }

              // Set assertions on new Timeoff
              (timeoffSaveRes.body.name).should.equal(timeoff.name);
              should.exist(timeoffSaveRes.body.user);
              should.equal(timeoffSaveRes.body.user._id, orphanId);

              // force the Timeoff to have an orphaned user reference
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

                    // Get the Timeoff
                    agent.get('/api/timeoffs/' + timeoffSaveRes.body._id)
                      .expect(200)
                      .end(function (timeoffInfoErr, timeoffInfoRes) {
                        // Handle Timeoff error
                        if (timeoffInfoErr) {
                          return done(timeoffInfoErr);
                        }

                        // Set assertions
                        (timeoffInfoRes.body._id).should.equal(timeoffSaveRes.body._id);
                        (timeoffInfoRes.body.name).should.equal(timeoff.name);
                        should.equal(timeoffInfoRes.body.user, undefined);

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
      Timeoff.remove().exec(done);
    });
  });
});
