'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Splitbill = mongoose.model('Splitbill'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app,
  agent,
  credentials,
  user,
  splitbill;

/**
 * Splitbill routes tests
 */
describe('Splitbill CRUD tests', function () {

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

    // Save a user to the test db and create new Splitbill
    user.save(function () {
      splitbill = {
        name: 'Splitbill name'
      };

      done();
    });
  });

  it('should be able to save a Splitbill if logged in', function (done) {
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

        // Save a new Splitbill
        agent.post('/api/splitbills')
          .send(splitbill)
          .expect(200)
          .end(function (splitbillSaveErr, splitbillSaveRes) {
            // Handle Splitbill save error
            if (splitbillSaveErr) {
              return done(splitbillSaveErr);
            }

            // Get a list of Splitbills
            agent.get('/api/splitbills')
              .end(function (splitbillsGetErr, splitbillsGetRes) {
                // Handle Splitbills save error
                if (splitbillsGetErr) {
                  return done(splitbillsGetErr);
                }

                // Get Splitbills list
                var splitbills = splitbillsGetRes.body;

                // Set assertions
                (splitbills[0].user._id).should.equal(userId);
                (splitbills[0].name).should.match('Splitbill name');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an Splitbill if not logged in', function (done) {
    agent.post('/api/splitbills')
      .send(splitbill)
      .expect(403)
      .end(function (splitbillSaveErr, splitbillSaveRes) {
        // Call the assertion callback
        done(splitbillSaveErr);
      });
  });

  it('should not be able to save an Splitbill if no name is provided', function (done) {
    // Invalidate name field
    splitbill.name = '';

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

        // Save a new Splitbill
        agent.post('/api/splitbills')
          .send(splitbill)
          .expect(400)
          .end(function (splitbillSaveErr, splitbillSaveRes) {
            // Set message assertion
            (splitbillSaveRes.body.message).should.match('Please fill Splitbill name');

            // Handle Splitbill save error
            done(splitbillSaveErr);
          });
      });
  });

  it('should be able to update an Splitbill if signed in', function (done) {
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

        // Save a new Splitbill
        agent.post('/api/splitbills')
          .send(splitbill)
          .expect(200)
          .end(function (splitbillSaveErr, splitbillSaveRes) {
            // Handle Splitbill save error
            if (splitbillSaveErr) {
              return done(splitbillSaveErr);
            }

            // Update Splitbill name
            splitbill.name = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing Splitbill
            agent.put('/api/splitbills/' + splitbillSaveRes.body._id)
              .send(splitbill)
              .expect(200)
              .end(function (splitbillUpdateErr, splitbillUpdateRes) {
                // Handle Splitbill update error
                if (splitbillUpdateErr) {
                  return done(splitbillUpdateErr);
                }

                // Set assertions
                (splitbillUpdateRes.body._id).should.equal(splitbillSaveRes.body._id);
                (splitbillUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of Splitbills if not signed in', function (done) {
    // Create new Splitbill model instance
    var splitbillObj = new Splitbill(splitbill);

    // Save the splitbill
    splitbillObj.save(function () {
      // Request Splitbills
      request(app).get('/api/splitbills')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single Splitbill if not signed in', function (done) {
    // Create new Splitbill model instance
    var splitbillObj = new Splitbill(splitbill);

    // Save the Splitbill
    splitbillObj.save(function () {
      request(app).get('/api/splitbills/' + splitbillObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('name', splitbill.name);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single Splitbill with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/splitbills/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Splitbill is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single Splitbill which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent Splitbill
    request(app).get('/api/splitbills/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No Splitbill with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an Splitbill if signed in', function (done) {
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

        // Save a new Splitbill
        agent.post('/api/splitbills')
          .send(splitbill)
          .expect(200)
          .end(function (splitbillSaveErr, splitbillSaveRes) {
            // Handle Splitbill save error
            if (splitbillSaveErr) {
              return done(splitbillSaveErr);
            }

            // Delete an existing Splitbill
            agent.delete('/api/splitbills/' + splitbillSaveRes.body._id)
              .send(splitbill)
              .expect(200)
              .end(function (splitbillDeleteErr, splitbillDeleteRes) {
                // Handle splitbill error error
                if (splitbillDeleteErr) {
                  return done(splitbillDeleteErr);
                }

                // Set assertions
                (splitbillDeleteRes.body._id).should.equal(splitbillSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an Splitbill if not signed in', function (done) {
    // Set Splitbill user
    splitbill.user = user;

    // Create new Splitbill model instance
    var splitbillObj = new Splitbill(splitbill);

    // Save the Splitbill
    splitbillObj.save(function () {
      // Try deleting Splitbill
      request(app).delete('/api/splitbills/' + splitbillObj._id)
        .expect(403)
        .end(function (splitbillDeleteErr, splitbillDeleteRes) {
          // Set message assertion
          (splitbillDeleteRes.body.message).should.match('User is not authorized');

          // Handle Splitbill error error
          done(splitbillDeleteErr);
        });

    });
  });

  it('should be able to get a single Splitbill that has an orphaned user reference', function (done) {
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

          // Save a new Splitbill
          agent.post('/api/splitbills')
            .send(splitbill)
            .expect(200)
            .end(function (splitbillSaveErr, splitbillSaveRes) {
              // Handle Splitbill save error
              if (splitbillSaveErr) {
                return done(splitbillSaveErr);
              }

              // Set assertions on new Splitbill
              (splitbillSaveRes.body.name).should.equal(splitbill.name);
              should.exist(splitbillSaveRes.body.user);
              should.equal(splitbillSaveRes.body.user._id, orphanId);

              // force the Splitbill to have an orphaned user reference
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

                    // Get the Splitbill
                    agent.get('/api/splitbills/' + splitbillSaveRes.body._id)
                      .expect(200)
                      .end(function (splitbillInfoErr, splitbillInfoRes) {
                        // Handle Splitbill error
                        if (splitbillInfoErr) {
                          return done(splitbillInfoErr);
                        }

                        // Set assertions
                        (splitbillInfoRes.body._id).should.equal(splitbillSaveRes.body._id);
                        (splitbillInfoRes.body.name).should.equal(splitbill.name);
                        should.equal(splitbillInfoRes.body.user, undefined);

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
      Splitbill.remove().exec(done);
    });
  });
});
