'use strict';

/**
 * Module dependencies
 */
var acl = require('acl');

// Using the memory backend
acl = new acl(new acl.memoryBackend());

/**
 * Invoke Settingsaccounts Permissions
 */
exports.invokeRolesPolicies = function () {
  acl.allow([{
    roles: ['admin'],
    allows: [{
      resources: '/api/settingsaccounts',
      permissions: '*'
    }, {
      resources: '/api/settingsaccounts/quicksave',
      permissions: '*'
    }, {
      resources: '/api/settingsaccounts/listservice',
      permissions: '*'
    }, {
      resources: '/api/settingsaccounts/getcurrentuser',
      permissions: '*'
    }, {
      resources: '/api/settingsaccounts/listcustomers',
      permissions: '*'
    }]
  }, {
    roles: ['user'],
    allows: [{
      resources: '/api/settingsaccounts',
      permissions: ['get', 'post']
    }, {
      resources: '/api/settingsaccounts/quicksave',
      permissions: '*'
    }, {
      resources: '/api/settingsaccounts/getcurrentuser',
      permissions: '*'
    }, {
      resources: '/api/settingsaccounts/:settingsaccountId',
      permissions: ['get']
    }]
  }, {
    roles: ['guest'],
    allows: [{
      resources: '/api/settingsaccounts',
      permissions: ['get']
    }, {
      resources: '/api/settingsaccounts/:settingsaccountId',
      permissions: ['get']
    }]
  }]);
};

/**
 * Check If Settingsaccounts Policy Allows
 */
exports.isAllowed = function (req, res, next) {
  var roles = (req.user) ? req.user.roles : ['guest'];

  // If an Settingsaccount is being processed and the current user created it then allow any manipulation
  if (req.settingsaccount && req.user && req.settingsaccount.user && req.settingsaccount.user.id === req.user.id) {
    return next();
  }

  // Check for user roles
  acl.areAnyRolesAllowed(roles, req.route.path, req.method.toLowerCase(), function (err, isAllowed) {
    if (err) {
      // An authorization error occurred
      return res.status(500).send('Unexpected authorization error');
    } else {
      if (isAllowed) {
        // Access granted! Invoke next middleware
        return next();
      } else {
        return res.status(403).json({
          message: 'User is not authorized'
        });
      }
    }
  });
};
