'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Station = mongoose.model('Station'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app,
  agent,
  credentials,
  user,
  station;

/**
 * Station routes tests
 */
describe('Station CRUD tests', function () {

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

    // Save a user to the test db and create new Station
    user.save(function () {
      station = {
        name: 'Station name'
      };

      done();
    });
  });

  it('should be able to save a Station if logged in', function (done) {
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

        // Save a new Station
        agent.post('/api/stations')
          .send(station)
          .expect(200)
          .end(function (stationSaveErr, stationSaveRes) {
            // Handle Station save error
            if (stationSaveErr) {
              return done(stationSaveErr);
            }

            // Get a list of Stations
            agent.get('/api/stations')
              .end(function (stationsGetErr, stationsGetRes) {
                // Handle Stations save error
                if (stationsGetErr) {
                  return done(stationsGetErr);
                }

                // Get Stations list
                var stations = stationsGetRes.body;

                // Set assertions
                (stations[0].user._id).should.equal(userId);
                (stations[0].name).should.match('Station name');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an Station if not logged in', function (done) {
    agent.post('/api/stations')
      .send(station)
      .expect(403)
      .end(function (stationSaveErr, stationSaveRes) {
        // Call the assertion callback
        done(stationSaveErr);
      });
  });

  it('should not be able to save an Station if no name is provided', function (done) {
    // Invalidate name field
    station.name = '';

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

        // Save a new Station
        agent.post('/api/stations')
          .send(station)
          .expect(400)
          .end(function (stationSaveErr, stationSaveRes) {
            // Set message assertion
            (stationSaveRes.body.message).should.match('Please fill Station name');

            // Handle Station save error
            done(stationSaveErr);
          });
      });
  });

  it('should be able to update an Station if signed in', function (done) {
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

        // Save a new Station
        agent.post('/api/stations')
          .send(station)
          .expect(200)
          .end(function (stationSaveErr, stationSaveRes) {
            // Handle Station save error
            if (stationSaveErr) {
              return done(stationSaveErr);
            }

            // Update Station name
            station.name = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing Station
            agent.put('/api/stations/' + stationSaveRes.body._id)
              .send(station)
              .expect(200)
              .end(function (stationUpdateErr, stationUpdateRes) {
                // Handle Station update error
                if (stationUpdateErr) {
                  return done(stationUpdateErr);
                }

                // Set assertions
                (stationUpdateRes.body._id).should.equal(stationSaveRes.body._id);
                (stationUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of Stations if not signed in', function (done) {
    // Create new Station model instance
    var stationObj = new Station(station);

    // Save the station
    stationObj.save(function () {
      // Request Stations
      request(app).get('/api/stations')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single Station if not signed in', function (done) {
    // Create new Station model instance
    var stationObj = new Station(station);

    // Save the Station
    stationObj.save(function () {
      request(app).get('/api/stations/' + stationObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('name', station.name);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single Station with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/stations/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Station is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single Station which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent Station
    request(app).get('/api/stations/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No Station with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an Station if signed in', function (done) {
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

        // Save a new Station
        agent.post('/api/stations')
          .send(station)
          .expect(200)
          .end(function (stationSaveErr, stationSaveRes) {
            // Handle Station save error
            if (stationSaveErr) {
              return done(stationSaveErr);
            }

            // Delete an existing Station
            agent.delete('/api/stations/' + stationSaveRes.body._id)
              .send(station)
              .expect(200)
              .end(function (stationDeleteErr, stationDeleteRes) {
                // Handle station error error
                if (stationDeleteErr) {
                  return done(stationDeleteErr);
                }

                // Set assertions
                (stationDeleteRes.body._id).should.equal(stationSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an Station if not signed in', function (done) {
    // Set Station user
    station.user = user;

    // Create new Station model instance
    var stationObj = new Station(station);

    // Save the Station
    stationObj.save(function () {
      // Try deleting Station
      request(app).delete('/api/stations/' + stationObj._id)
        .expect(403)
        .end(function (stationDeleteErr, stationDeleteRes) {
          // Set message assertion
          (stationDeleteRes.body.message).should.match('User is not authorized');

          // Handle Station error error
          done(stationDeleteErr);
        });

    });
  });

  it('should be able to get a single Station that has an orphaned user reference', function (done) {
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

          // Save a new Station
          agent.post('/api/stations')
            .send(station)
            .expect(200)
            .end(function (stationSaveErr, stationSaveRes) {
              // Handle Station save error
              if (stationSaveErr) {
                return done(stationSaveErr);
              }

              // Set assertions on new Station
              (stationSaveRes.body.name).should.equal(station.name);
              should.exist(stationSaveRes.body.user);
              should.equal(stationSaveRes.body.user._id, orphanId);

              // force the Station to have an orphaned user reference
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

                    // Get the Station
                    agent.get('/api/stations/' + stationSaveRes.body._id)
                      .expect(200)
                      .end(function (stationInfoErr, stationInfoRes) {
                        // Handle Station error
                        if (stationInfoErr) {
                          return done(stationInfoErr);
                        }

                        // Set assertions
                        (stationInfoRes.body._id).should.equal(stationSaveRes.body._id);
                        (stationInfoRes.body.name).should.equal(station.name);
                        should.equal(stationInfoRes.body.user, undefined);

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
      Station.remove().exec(done);
    });
  });
});
