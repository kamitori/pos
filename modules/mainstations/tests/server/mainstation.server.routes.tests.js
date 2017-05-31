'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Mainstation = mongoose.model('Mainstation'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app,
  agent,
  credentials,
  user,
  mainstation;

/**
 * Mainstation routes tests
 */
describe('Mainstation CRUD tests', function () {

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

    // Save a user to the test db and create new Mainstation
    user.save(function () {
      mainstation = {
        name: 'Mainstation name'
      };

      done();
    });
  });

  it('should be able to save a Mainstation if logged in', function (done) {
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

        // Save a new Mainstation
        agent.post('/api/mainstations')
          .send(mainstation)
          .expect(200)
          .end(function (mainstationSaveErr, mainstationSaveRes) {
            // Handle Mainstation save error
            if (mainstationSaveErr) {
              return done(mainstationSaveErr);
            }

            // Get a list of Mainstations
            agent.get('/api/mainstations')
              .end(function (mainstationsGetErr, mainstationsGetRes) {
                // Handle Mainstations save error
                if (mainstationsGetErr) {
                  return done(mainstationsGetErr);
                }

                // Get Mainstations list
                var mainstations = mainstationsGetRes.body;

                // Set assertions
                (mainstations[0].user._id).should.equal(userId);
                (mainstations[0].name).should.match('Mainstation name');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an Mainstation if not logged in', function (done) {
    agent.post('/api/mainstations')
      .send(mainstation)
      .expect(403)
      .end(function (mainstationSaveErr, mainstationSaveRes) {
        // Call the assertion callback
        done(mainstationSaveErr);
      });
  });

  it('should not be able to save an Mainstation if no name is provided', function (done) {
    // Invalidate name field
    mainstation.name = '';

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

        // Save a new Mainstation
        agent.post('/api/mainstations')
          .send(mainstation)
          .expect(400)
          .end(function (mainstationSaveErr, mainstationSaveRes) {
            // Set message assertion
            (mainstationSaveRes.body.message).should.match('Please fill Mainstation name');

            // Handle Mainstation save error
            done(mainstationSaveErr);
          });
      });
  });

  it('should be able to update an Mainstation if signed in', function (done) {
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

        // Save a new Mainstation
        agent.post('/api/mainstations')
          .send(mainstation)
          .expect(200)
          .end(function (mainstationSaveErr, mainstationSaveRes) {
            // Handle Mainstation save error
            if (mainstationSaveErr) {
              return done(mainstationSaveErr);
            }

            // Update Mainstation name
            mainstation.name = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing Mainstation
            agent.put('/api/mainstations/' + mainstationSaveRes.body._id)
              .send(mainstation)
              .expect(200)
              .end(function (mainstationUpdateErr, mainstationUpdateRes) {
                // Handle Mainstation update error
                if (mainstationUpdateErr) {
                  return done(mainstationUpdateErr);
                }

                // Set assertions
                (mainstationUpdateRes.body._id).should.equal(mainstationSaveRes.body._id);
                (mainstationUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of Mainstations if not signed in', function (done) {
    // Create new Mainstation model instance
    var mainstationObj = new Mainstation(mainstation);

    // Save the mainstation
    mainstationObj.save(function () {
      // Request Mainstations
      request(app).get('/api/mainstations')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single Mainstation if not signed in', function (done) {
    // Create new Mainstation model instance
    var mainstationObj = new Mainstation(mainstation);

    // Save the Mainstation
    mainstationObj.save(function () {
      request(app).get('/api/mainstations/' + mainstationObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('name', mainstation.name);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single Mainstation with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/mainstations/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Mainstation is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single Mainstation which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent Mainstation
    request(app).get('/api/mainstations/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No Mainstation with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an Mainstation if signed in', function (done) {
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

        // Save a new Mainstation
        agent.post('/api/mainstations')
          .send(mainstation)
          .expect(200)
          .end(function (mainstationSaveErr, mainstationSaveRes) {
            // Handle Mainstation save error
            if (mainstationSaveErr) {
              return done(mainstationSaveErr);
            }

            // Delete an existing Mainstation
            agent.delete('/api/mainstations/' + mainstationSaveRes.body._id)
              .send(mainstation)
              .expect(200)
              .end(function (mainstationDeleteErr, mainstationDeleteRes) {
                // Handle mainstation error error
                if (mainstationDeleteErr) {
                  return done(mainstationDeleteErr);
                }

                // Set assertions
                (mainstationDeleteRes.body._id).should.equal(mainstationSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an Mainstation if not signed in', function (done) {
    // Set Mainstation user
    mainstation.user = user;

    // Create new Mainstation model instance
    var mainstationObj = new Mainstation(mainstation);

    // Save the Mainstation
    mainstationObj.save(function () {
      // Try deleting Mainstation
      request(app).delete('/api/mainstations/' + mainstationObj._id)
        .expect(403)
        .end(function (mainstationDeleteErr, mainstationDeleteRes) {
          // Set message assertion
          (mainstationDeleteRes.body.message).should.match('User is not authorized');

          // Handle Mainstation error error
          done(mainstationDeleteErr);
        });

    });
  });

  it('should be able to get a single Mainstation that has an orphaned user reference', function (done) {
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

          // Save a new Mainstation
          agent.post('/api/mainstations')
            .send(mainstation)
            .expect(200)
            .end(function (mainstationSaveErr, mainstationSaveRes) {
              // Handle Mainstation save error
              if (mainstationSaveErr) {
                return done(mainstationSaveErr);
              }

              // Set assertions on new Mainstation
              (mainstationSaveRes.body.name).should.equal(mainstation.name);
              should.exist(mainstationSaveRes.body.user);
              should.equal(mainstationSaveRes.body.user._id, orphanId);

              // force the Mainstation to have an orphaned user reference
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

                    // Get the Mainstation
                    agent.get('/api/mainstations/' + mainstationSaveRes.body._id)
                      .expect(200)
                      .end(function (mainstationInfoErr, mainstationInfoRes) {
                        // Handle Mainstation error
                        if (mainstationInfoErr) {
                          return done(mainstationInfoErr);
                        }

                        // Set assertions
                        (mainstationInfoRes.body._id).should.equal(mainstationSaveRes.body._id);
                        (mainstationInfoRes.body.name).should.equal(mainstation.name);
                        should.equal(mainstationInfoRes.body.user, undefined);

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
      Mainstation.remove().exec(done);
    });
  });
});
