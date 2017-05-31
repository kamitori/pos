'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Settingsaccount = mongoose.model('Settingsaccount'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app,
  agent,
  credentials,
  user,
  settingsaccount;

/**
 * Settingsaccount routes tests
 */
describe('Settingsaccount CRUD tests', function () {

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

    // Save a user to the test db and create new Settingsaccount
    user.save(function () {
      settingsaccount = {
        name: 'Settingsaccount name'
      };

      done();
    });
  });

  it('should be able to save a Settingsaccount if logged in', function (done) {
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

        // Save a new Settingsaccount
        agent.post('/api/settingsaccounts')
          .send(settingsaccount)
          .expect(200)
          .end(function (settingsaccountSaveErr, settingsaccountSaveRes) {
            // Handle Settingsaccount save error
            if (settingsaccountSaveErr) {
              return done(settingsaccountSaveErr);
            }

            // Get a list of Settingsaccounts
            agent.get('/api/settingsaccounts')
              .end(function (settingsaccountsGetErr, settingsaccountsGetRes) {
                // Handle Settingsaccounts save error
                if (settingsaccountsGetErr) {
                  return done(settingsaccountsGetErr);
                }

                // Get Settingsaccounts list
                var settingsaccounts = settingsaccountsGetRes.body;

                // Set assertions
                (settingsaccounts[0].user._id).should.equal(userId);
                (settingsaccounts[0].name).should.match('Settingsaccount name');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an Settingsaccount if not logged in', function (done) {
    agent.post('/api/settingsaccounts')
      .send(settingsaccount)
      .expect(403)
      .end(function (settingsaccountSaveErr, settingsaccountSaveRes) {
        // Call the assertion callback
        done(settingsaccountSaveErr);
      });
  });

  it('should not be able to save an Settingsaccount if no name is provided', function (done) {
    // Invalidate name field
    settingsaccount.name = '';

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

        // Save a new Settingsaccount
        agent.post('/api/settingsaccounts')
          .send(settingsaccount)
          .expect(400)
          .end(function (settingsaccountSaveErr, settingsaccountSaveRes) {
            // Set message assertion
            (settingsaccountSaveRes.body.message).should.match('Please fill Settingsaccount name');

            // Handle Settingsaccount save error
            done(settingsaccountSaveErr);
          });
      });
  });

  it('should be able to update an Settingsaccount if signed in', function (done) {
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

        // Save a new Settingsaccount
        agent.post('/api/settingsaccounts')
          .send(settingsaccount)
          .expect(200)
          .end(function (settingsaccountSaveErr, settingsaccountSaveRes) {
            // Handle Settingsaccount save error
            if (settingsaccountSaveErr) {
              return done(settingsaccountSaveErr);
            }

            // Update Settingsaccount name
            settingsaccount.name = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing Settingsaccount
            agent.put('/api/settingsaccounts/' + settingsaccountSaveRes.body._id)
              .send(settingsaccount)
              .expect(200)
              .end(function (settingsaccountUpdateErr, settingsaccountUpdateRes) {
                // Handle Settingsaccount update error
                if (settingsaccountUpdateErr) {
                  return done(settingsaccountUpdateErr);
                }

                // Set assertions
                (settingsaccountUpdateRes.body._id).should.equal(settingsaccountSaveRes.body._id);
                (settingsaccountUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of Settingsaccounts if not signed in', function (done) {
    // Create new Settingsaccount model instance
    var settingsaccountObj = new Settingsaccount(settingsaccount);

    // Save the settingsaccount
    settingsaccountObj.save(function () {
      // Request Settingsaccounts
      request(app).get('/api/settingsaccounts')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single Settingsaccount if not signed in', function (done) {
    // Create new Settingsaccount model instance
    var settingsaccountObj = new Settingsaccount(settingsaccount);

    // Save the Settingsaccount
    settingsaccountObj.save(function () {
      request(app).get('/api/settingsaccounts/' + settingsaccountObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('name', settingsaccount.name);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single Settingsaccount with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/settingsaccounts/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Settingsaccount is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single Settingsaccount which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent Settingsaccount
    request(app).get('/api/settingsaccounts/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No Settingsaccount with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an Settingsaccount if signed in', function (done) {
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

        // Save a new Settingsaccount
        agent.post('/api/settingsaccounts')
          .send(settingsaccount)
          .expect(200)
          .end(function (settingsaccountSaveErr, settingsaccountSaveRes) {
            // Handle Settingsaccount save error
            if (settingsaccountSaveErr) {
              return done(settingsaccountSaveErr);
            }

            // Delete an existing Settingsaccount
            agent.delete('/api/settingsaccounts/' + settingsaccountSaveRes.body._id)
              .send(settingsaccount)
              .expect(200)
              .end(function (settingsaccountDeleteErr, settingsaccountDeleteRes) {
                // Handle settingsaccount error error
                if (settingsaccountDeleteErr) {
                  return done(settingsaccountDeleteErr);
                }

                // Set assertions
                (settingsaccountDeleteRes.body._id).should.equal(settingsaccountSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an Settingsaccount if not signed in', function (done) {
    // Set Settingsaccount user
    settingsaccount.user = user;

    // Create new Settingsaccount model instance
    var settingsaccountObj = new Settingsaccount(settingsaccount);

    // Save the Settingsaccount
    settingsaccountObj.save(function () {
      // Try deleting Settingsaccount
      request(app).delete('/api/settingsaccounts/' + settingsaccountObj._id)
        .expect(403)
        .end(function (settingsaccountDeleteErr, settingsaccountDeleteRes) {
          // Set message assertion
          (settingsaccountDeleteRes.body.message).should.match('User is not authorized');

          // Handle Settingsaccount error error
          done(settingsaccountDeleteErr);
        });

    });
  });

  it('should be able to get a single Settingsaccount that has an orphaned user reference', function (done) {
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

          // Save a new Settingsaccount
          agent.post('/api/settingsaccounts')
            .send(settingsaccount)
            .expect(200)
            .end(function (settingsaccountSaveErr, settingsaccountSaveRes) {
              // Handle Settingsaccount save error
              if (settingsaccountSaveErr) {
                return done(settingsaccountSaveErr);
              }

              // Set assertions on new Settingsaccount
              (settingsaccountSaveRes.body.name).should.equal(settingsaccount.name);
              should.exist(settingsaccountSaveRes.body.user);
              should.equal(settingsaccountSaveRes.body.user._id, orphanId);

              // force the Settingsaccount to have an orphaned user reference
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

                    // Get the Settingsaccount
                    agent.get('/api/settingsaccounts/' + settingsaccountSaveRes.body._id)
                      .expect(200)
                      .end(function (settingsaccountInfoErr, settingsaccountInfoRes) {
                        // Handle Settingsaccount error
                        if (settingsaccountInfoErr) {
                          return done(settingsaccountInfoErr);
                        }

                        // Set assertions
                        (settingsaccountInfoRes.body._id).should.equal(settingsaccountSaveRes.body._id);
                        (settingsaccountInfoRes.body.name).should.equal(settingsaccount.name);
                        should.equal(settingsaccountInfoRes.body.user, undefined);

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
      Settingsaccount.remove().exec(done);
    });
  });
});
