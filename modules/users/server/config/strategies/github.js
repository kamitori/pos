'use strict';

/**
 * Module dependencies
 */
var passport = require('passport'),
  GithubStrategy = require('passport-github').Strategy,
  users = require('../../controllers/users.server.controller');

module.exports = function (config) {
  // Use github strategy
  passport.use(new GithubStrategy({
    clientID: config.github.clientID,
    clientSecret: config.github.clientSecret,
    callbackURL: config.github.callbackURL,
    passReqToCallback: true
  },
  function (req, accessToken, refreshToken, profile, done) {
    // Set the provider data and include tokens
    var providerData = profile._json;
    providerData.accessToken = accessToken;
    providerData.refreshToken = refreshToken;

    // Create the user OAuth profile
    var displayName = profile.displayName ? profile.displayName.trim() : profile.username.trim();
    var iSpace = displayName.indexOf(' '); // index of the whitespace following the first_name
    var first_name = iSpace !== -1 ? displayName.substring(0, iSpace) : displayName;
    var last_name = iSpace !== -1 ? displayName.substring(iSpace + 1) : '';

    var providerUserProfile = {
      first_name: first_name,
      last_name: last_name,
      displayName: displayName,
      email: (profile.emails && profile.emails.length) ? profile.emails[0].value : undefined,
      username: profile.username,
      // jscs:disable requireCamelCaseOrUpperCaseIdentifiers
      profileImageURL: (providerData.avatar_url) ? providerData.avatar_url : undefined,
      // jscs:enable
      provider: 'github',
      providerIdentifierField: 'id',
      providerData: providerData
    };

    // Save the user OAuth profile
    users.saveOAuthUserProfile(req, providerUserProfile, done);
  }));
};
