'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Salesreport = mongoose.model('Salesreport'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app,
  agent,
  credentials,
  user,
  salesreport;

/**
 * Salesreport routes tests
 */
describe('Salesreport CRUD tests', function () {

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

    // Save a user to the test db and create new Salesreport
    user.save(function () {
      salesreport = {
        name: 'Salesreport name'
      };

      done();
    });
  });

  it('should be able to save a Salesreport if logged in', function (done) {
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

        // Save a new Salesreport
        agent.post('/api/salesreports')
          .send(salesreport)
          .expect(200)
          .end(function (salesreportSaveErr, salesreportSaveRes) {
            // Handle Salesreport save error
            if (salesreportSaveErr) {
              return done(salesreportSaveErr);
            }

            // Get a list of Salesreports
            agent.get('/api/salesreports')
              .end(function (salesreportsGetErr, salesreportsGetRes) {
                // Handle Salesreports save error
                if (salesreportsGetErr) {
                  return done(salesreportsGetErr);
                }

                // Get Salesreports list
                var salesreports = salesreportsGetRes.body;

                // Set assertions
                (salesreports[0].user._id).should.equal(userId);
                (salesreports[0].name).should.match('Salesreport name');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an Salesreport if not logged in', function (done) {
    agent.post('/api/salesreports')
      .send(salesreport)
      .expect(403)
      .end(function (salesreportSaveErr, salesreportSaveRes) {
        // Call the assertion callback
        done(salesreportSaveErr);
      });
  });

  it('should not be able to save an Salesreport if no name is provided', function (done) {
    // Invalidate name field
    salesreport.name = '';

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

        // Save a new Salesreport
        agent.post('/api/salesreports')
          .send(salesreport)
          .expect(400)
          .end(function (salesreportSaveErr, salesreportSaveRes) {
            // Set message assertion
            (salesreportSaveRes.body.message).should.match('Please fill Salesreport name');

            // Handle Salesreport save error
            done(salesreportSaveErr);
          });
      });
  });

  it('should be able to update an Salesreport if signed in', function (done) {
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

        // Save a new Salesreport
        agent.post('/api/salesreports')
          .send(salesreport)
          .expect(200)
          .end(function (salesreportSaveErr, salesreportSaveRes) {
            // Handle Salesreport save error
            if (salesreportSaveErr) {
              return done(salesreportSaveErr);
            }

            // Update Salesreport name
            salesreport.name = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing Salesreport
            agent.put('/api/salesreports/' + salesreportSaveRes.body._id)
              .send(salesreport)
              .expect(200)
              .end(function (salesreportUpdateErr, salesreportUpdateRes) {
                // Handle Salesreport update error
                if (salesreportUpdateErr) {
                  return done(salesreportUpdateErr);
                }

                // Set assertions
                (salesreportUpdateRes.body._id).should.equal(salesreportSaveRes.body._id);
                (salesreportUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of Salesreports if not signed in', function (done) {
    // Create new Salesreport model instance
    var salesreportObj = new Salesreport(salesreport);

    // Save the salesreport
    salesreportObj.save(function () {
      // Request Salesreports
      request(app).get('/api/salesreports')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single Salesreport if not signed in', function (done) {
    // Create new Salesreport model instance
    var salesreportObj = new Salesreport(salesreport);

    // Save the Salesreport
    salesreportObj.save(function () {
      request(app).get('/api/salesreports/' + salesreportObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('name', salesreport.name);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single Salesreport with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/salesreports/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Salesreport is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single Salesreport which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent Salesreport
    request(app).get('/api/salesreports/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No Salesreport with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an Salesreport if signed in', function (done) {
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

        // Save a new Salesreport
        agent.post('/api/salesreports')
          .send(salesreport)
          .expect(200)
          .end(function (salesreportSaveErr, salesreportSaveRes) {
            // Handle Salesreport save error
            if (salesreportSaveErr) {
              return done(salesreportSaveErr);
            }

            // Delete an existing Salesreport
            agent.delete('/api/salesreports/' + salesreportSaveRes.body._id)
              .send(salesreport)
              .expect(200)
              .end(function (salesreportDeleteErr, salesreportDeleteRes) {
                // Handle salesreport error error
                if (salesreportDeleteErr) {
                  return done(salesreportDeleteErr);
                }

                // Set assertions
                (salesreportDeleteRes.body._id).should.equal(salesreportSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an Salesreport if not signed in', function (done) {
    // Set Salesreport user
    salesreport.user = user;

    // Create new Salesreport model instance
    var salesreportObj = new Salesreport(salesreport);

    // Save the Salesreport
    salesreportObj.save(function () {
      // Try deleting Salesreport
      request(app).delete('/api/salesreports/' + salesreportObj._id)
        .expect(403)
        .end(function (salesreportDeleteErr, salesreportDeleteRes) {
          // Set message assertion
          (salesreportDeleteRes.body.message).should.match('User is not authorized');

          // Handle Salesreport error error
          done(salesreportDeleteErr);
        });

    });
  });

  it('should be able to get a single Salesreport that has an orphaned user reference', function (done) {
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

          // Save a new Salesreport
          agent.post('/api/salesreports')
            .send(salesreport)
            .expect(200)
            .end(function (salesreportSaveErr, salesreportSaveRes) {
              // Handle Salesreport save error
              if (salesreportSaveErr) {
                return done(salesreportSaveErr);
              }

              // Set assertions on new Salesreport
              (salesreportSaveRes.body.name).should.equal(salesreport.name);
              should.exist(salesreportSaveRes.body.user);
              should.equal(salesreportSaveRes.body.user._id, orphanId);

              // force the Salesreport to have an orphaned user reference
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

                    // Get the Salesreport
                    agent.get('/api/salesreports/' + salesreportSaveRes.body._id)
                      .expect(200)
                      .end(function (salesreportInfoErr, salesreportInfoRes) {
                        // Handle Salesreport error
                        if (salesreportInfoErr) {
                          return done(salesreportInfoErr);
                        }

                        // Set assertions
                        (salesreportInfoRes.body._id).should.equal(salesreportSaveRes.body._id);
                        (salesreportInfoRes.body.name).should.equal(salesreport.name);
                        should.equal(salesreportInfoRes.body.user, undefined);

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
      Salesreport.remove().exec(done);
    });
  });
});
