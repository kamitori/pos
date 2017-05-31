'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Selectlist = mongoose.model('Selectlist'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app,
  agent,
  credentials,
  user,
  selectlist;

/**
 * Selectlist routes tests
 */
describe('Selectlist CRUD tests', function () {

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

    // Save a user to the test db and create new Selectlist
    user.save(function () {
      selectlist = {
        name: 'Selectlist name'
      };

      done();
    });
  });

  it('should be able to save a Selectlist if logged in', function (done) {
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

        // Save a new Selectlist
        agent.post('/api/selectlists')
          .send(selectlist)
          .expect(200)
          .end(function (selectlistSaveErr, selectlistSaveRes) {
            // Handle Selectlist save error
            if (selectlistSaveErr) {
              return done(selectlistSaveErr);
            }

            // Get a list of Selectlists
            agent.get('/api/selectlists')
              .end(function (selectlistsGetErr, selectlistsGetRes) {
                // Handle Selectlists save error
                if (selectlistsGetErr) {
                  return done(selectlistsGetErr);
                }

                // Get Selectlists list
                var selectlists = selectlistsGetRes.body;

                // Set assertions
                (selectlists[0].user._id).should.equal(userId);
                (selectlists[0].name).should.match('Selectlist name');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an Selectlist if not logged in', function (done) {
    agent.post('/api/selectlists')
      .send(selectlist)
      .expect(403)
      .end(function (selectlistSaveErr, selectlistSaveRes) {
        // Call the assertion callback
        done(selectlistSaveErr);
      });
  });

  it('should not be able to save an Selectlist if no name is provided', function (done) {
    // Invalidate name field
    selectlist.name = '';

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

        // Save a new Selectlist
        agent.post('/api/selectlists')
          .send(selectlist)
          .expect(400)
          .end(function (selectlistSaveErr, selectlistSaveRes) {
            // Set message assertion
            (selectlistSaveRes.body.message).should.match('Please fill Selectlist name');

            // Handle Selectlist save error
            done(selectlistSaveErr);
          });
      });
  });

  it('should be able to update an Selectlist if signed in', function (done) {
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

        // Save a new Selectlist
        agent.post('/api/selectlists')
          .send(selectlist)
          .expect(200)
          .end(function (selectlistSaveErr, selectlistSaveRes) {
            // Handle Selectlist save error
            if (selectlistSaveErr) {
              return done(selectlistSaveErr);
            }

            // Update Selectlist name
            selectlist.name = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing Selectlist
            agent.put('/api/selectlists/' + selectlistSaveRes.body._id)
              .send(selectlist)
              .expect(200)
              .end(function (selectlistUpdateErr, selectlistUpdateRes) {
                // Handle Selectlist update error
                if (selectlistUpdateErr) {
                  return done(selectlistUpdateErr);
                }

                // Set assertions
                (selectlistUpdateRes.body._id).should.equal(selectlistSaveRes.body._id);
                (selectlistUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of Selectlists if not signed in', function (done) {
    // Create new Selectlist model instance
    var selectlistObj = new Selectlist(selectlist);

    // Save the selectlist
    selectlistObj.save(function () {
      // Request Selectlists
      request(app).get('/api/selectlists')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single Selectlist if not signed in', function (done) {
    // Create new Selectlist model instance
    var selectlistObj = new Selectlist(selectlist);

    // Save the Selectlist
    selectlistObj.save(function () {
      request(app).get('/api/selectlists/' + selectlistObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('name', selectlist.name);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single Selectlist with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/selectlists/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Selectlist is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single Selectlist which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent Selectlist
    request(app).get('/api/selectlists/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No Selectlist with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an Selectlist if signed in', function (done) {
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

        // Save a new Selectlist
        agent.post('/api/selectlists')
          .send(selectlist)
          .expect(200)
          .end(function (selectlistSaveErr, selectlistSaveRes) {
            // Handle Selectlist save error
            if (selectlistSaveErr) {
              return done(selectlistSaveErr);
            }

            // Delete an existing Selectlist
            agent.delete('/api/selectlists/' + selectlistSaveRes.body._id)
              .send(selectlist)
              .expect(200)
              .end(function (selectlistDeleteErr, selectlistDeleteRes) {
                // Handle selectlist error error
                if (selectlistDeleteErr) {
                  return done(selectlistDeleteErr);
                }

                // Set assertions
                (selectlistDeleteRes.body._id).should.equal(selectlistSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an Selectlist if not signed in', function (done) {
    // Set Selectlist user
    selectlist.user = user;

    // Create new Selectlist model instance
    var selectlistObj = new Selectlist(selectlist);

    // Save the Selectlist
    selectlistObj.save(function () {
      // Try deleting Selectlist
      request(app).delete('/api/selectlists/' + selectlistObj._id)
        .expect(403)
        .end(function (selectlistDeleteErr, selectlistDeleteRes) {
          // Set message assertion
          (selectlistDeleteRes.body.message).should.match('User is not authorized');

          // Handle Selectlist error error
          done(selectlistDeleteErr);
        });

    });
  });

  it('should be able to get a single Selectlist that has an orphaned user reference', function (done) {
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

          // Save a new Selectlist
          agent.post('/api/selectlists')
            .send(selectlist)
            .expect(200)
            .end(function (selectlistSaveErr, selectlistSaveRes) {
              // Handle Selectlist save error
              if (selectlistSaveErr) {
                return done(selectlistSaveErr);
              }

              // Set assertions on new Selectlist
              (selectlistSaveRes.body.name).should.equal(selectlist.name);
              should.exist(selectlistSaveRes.body.user);
              should.equal(selectlistSaveRes.body.user._id, orphanId);

              // force the Selectlist to have an orphaned user reference
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

                    // Get the Selectlist
                    agent.get('/api/selectlists/' + selectlistSaveRes.body._id)
                      .expect(200)
                      .end(function (selectlistInfoErr, selectlistInfoRes) {
                        // Handle Selectlist error
                        if (selectlistInfoErr) {
                          return done(selectlistInfoErr);
                        }

                        // Set assertions
                        (selectlistInfoRes.body._id).should.equal(selectlistSaveRes.body._id);
                        (selectlistInfoRes.body.name).should.equal(selectlist.name);
                        should.equal(selectlistInfoRes.body.user, undefined);

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
      Selectlist.remove().exec(done);
    });
  });
});
