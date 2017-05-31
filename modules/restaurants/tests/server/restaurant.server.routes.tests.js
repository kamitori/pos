'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Restaurant = mongoose.model('Restaurant'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app,
  agent,
  credentials,
  user,
  restaurant;

/**
 * Restaurant routes tests
 */
describe('Restaurant CRUD tests', function () {

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

    // Save a user to the test db and create new Restaurant
    user.save(function () {
      restaurant = {
        name: 'Restaurant name'
      };

      done();
    });
  });

  it('should be able to save a Restaurant if logged in', function (done) {
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

        // Save a new Restaurant
        agent.post('/api/restaurants')
          .send(restaurant)
          .expect(200)
          .end(function (restaurantSaveErr, restaurantSaveRes) {
            // Handle Restaurant save error
            if (restaurantSaveErr) {
              return done(restaurantSaveErr);
            }

            // Get a list of Restaurants
            agent.get('/api/restaurants')
              .end(function (restaurantsGetErr, restaurantsGetRes) {
                // Handle Restaurants save error
                if (restaurantsGetErr) {
                  return done(restaurantsGetErr);
                }

                // Get Restaurants list
                var restaurants = restaurantsGetRes.body;

                // Set assertions
                (restaurants[0].user._id).should.equal(userId);
                (restaurants[0].name).should.match('Restaurant name');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an Restaurant if not logged in', function (done) {
    agent.post('/api/restaurants')
      .send(restaurant)
      .expect(403)
      .end(function (restaurantSaveErr, restaurantSaveRes) {
        // Call the assertion callback
        done(restaurantSaveErr);
      });
  });

  it('should not be able to save an Restaurant if no name is provided', function (done) {
    // Invalidate name field
    restaurant.name = '';

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

        // Save a new Restaurant
        agent.post('/api/restaurants')
          .send(restaurant)
          .expect(400)
          .end(function (restaurantSaveErr, restaurantSaveRes) {
            // Set message assertion
            (restaurantSaveRes.body.message).should.match('Please fill Restaurant name');

            // Handle Restaurant save error
            done(restaurantSaveErr);
          });
      });
  });

  it('should be able to update an Restaurant if signed in', function (done) {
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

        // Save a new Restaurant
        agent.post('/api/restaurants')
          .send(restaurant)
          .expect(200)
          .end(function (restaurantSaveErr, restaurantSaveRes) {
            // Handle Restaurant save error
            if (restaurantSaveErr) {
              return done(restaurantSaveErr);
            }

            // Update Restaurant name
            restaurant.name = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing Restaurant
            agent.put('/api/restaurants/' + restaurantSaveRes.body._id)
              .send(restaurant)
              .expect(200)
              .end(function (restaurantUpdateErr, restaurantUpdateRes) {
                // Handle Restaurant update error
                if (restaurantUpdateErr) {
                  return done(restaurantUpdateErr);
                }

                // Set assertions
                (restaurantUpdateRes.body._id).should.equal(restaurantSaveRes.body._id);
                (restaurantUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of Restaurants if not signed in', function (done) {
    // Create new Restaurant model instance
    var restaurantObj = new Restaurant(restaurant);

    // Save the restaurant
    restaurantObj.save(function () {
      // Request Restaurants
      request(app).get('/api/restaurants')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single Restaurant if not signed in', function (done) {
    // Create new Restaurant model instance
    var restaurantObj = new Restaurant(restaurant);

    // Save the Restaurant
    restaurantObj.save(function () {
      request(app).get('/api/restaurants/' + restaurantObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('name', restaurant.name);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single Restaurant with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/restaurants/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Restaurant is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single Restaurant which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent Restaurant
    request(app).get('/api/restaurants/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No Restaurant with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an Restaurant if signed in', function (done) {
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

        // Save a new Restaurant
        agent.post('/api/restaurants')
          .send(restaurant)
          .expect(200)
          .end(function (restaurantSaveErr, restaurantSaveRes) {
            // Handle Restaurant save error
            if (restaurantSaveErr) {
              return done(restaurantSaveErr);
            }

            // Delete an existing Restaurant
            agent.delete('/api/restaurants/' + restaurantSaveRes.body._id)
              .send(restaurant)
              .expect(200)
              .end(function (restaurantDeleteErr, restaurantDeleteRes) {
                // Handle restaurant error error
                if (restaurantDeleteErr) {
                  return done(restaurantDeleteErr);
                }

                // Set assertions
                (restaurantDeleteRes.body._id).should.equal(restaurantSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an Restaurant if not signed in', function (done) {
    // Set Restaurant user
    restaurant.user = user;

    // Create new Restaurant model instance
    var restaurantObj = new Restaurant(restaurant);

    // Save the Restaurant
    restaurantObj.save(function () {
      // Try deleting Restaurant
      request(app).delete('/api/restaurants/' + restaurantObj._id)
        .expect(403)
        .end(function (restaurantDeleteErr, restaurantDeleteRes) {
          // Set message assertion
          (restaurantDeleteRes.body.message).should.match('User is not authorized');

          // Handle Restaurant error error
          done(restaurantDeleteErr);
        });

    });
  });

  it('should be able to get a single Restaurant that has an orphaned user reference', function (done) {
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

          // Save a new Restaurant
          agent.post('/api/restaurants')
            .send(restaurant)
            .expect(200)
            .end(function (restaurantSaveErr, restaurantSaveRes) {
              // Handle Restaurant save error
              if (restaurantSaveErr) {
                return done(restaurantSaveErr);
              }

              // Set assertions on new Restaurant
              (restaurantSaveRes.body.name).should.equal(restaurant.name);
              should.exist(restaurantSaveRes.body.user);
              should.equal(restaurantSaveRes.body.user._id, orphanId);

              // force the Restaurant to have an orphaned user reference
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

                    // Get the Restaurant
                    agent.get('/api/restaurants/' + restaurantSaveRes.body._id)
                      .expect(200)
                      .end(function (restaurantInfoErr, restaurantInfoRes) {
                        // Handle Restaurant error
                        if (restaurantInfoErr) {
                          return done(restaurantInfoErr);
                        }

                        // Set assertions
                        (restaurantInfoRes.body._id).should.equal(restaurantSaveRes.body._id);
                        (restaurantInfoRes.body.name).should.equal(restaurant.name);
                        should.equal(restaurantInfoRes.body.user, undefined);

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
      Restaurant.remove().exec(done);
    });
  });
});
