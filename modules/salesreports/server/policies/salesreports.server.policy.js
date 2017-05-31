'use strict';

/**
 * Module dependencies
 */
var acl = require('acl');

// Using the memory backend
acl = new acl(new acl.memoryBackend());

/**
 * Invoke Salesreports Permissions
 */
exports.invokeRolesPolicies = function () {
  acl.allow([{
    roles: ['admin'],
    allows: [{
      resources: '/api/salesreports',
      permissions: '*'
    }, {
      resources: '/api/salesreports/getdata',
      permissions: '*'
    }, {
      resources: '/api/salesreports/getdatadates',
      permissions: '*'
    }, {
      resources: '/api/salesreports/:salesreportId',
      permissions: '*'
    }]
  }, {
    roles: ['user'],
    allows: [{
      resources: '/api/salesreports',
      permissions: '*'
    }, {
      resources: '/api/salesreports/getdata',
      permissions: '*'
    }, {
      resources: '/api/salesreports/getdatadates',
      permissions: '*'
    }, {
      resources: '/api/salesreports/:salesreportId',
      permissions: '*'
    }]
  }, {
    roles: ['guest'],
    allows: [{
      resources: '/api/salesreports',
      permissions: '*'
    }, {
      resources: '/api/salesreports/getdata',
      permissions: '*'
    }, {
      resources: '/api/salesreports/:salesreportId',
      permissions: '*'
    }]
  }]);
};

/**
 * Check If Salesreports Policy Allows
 */
exports.isAllowed = function (req, res, next) {
  var roles = (req.user) ? req.user.roles : ['guest'];

  // If an Salesreport is being processed and the current user created it then allow any manipulation
  if (req.salesreport && req.user && req.salesreport.user && req.salesreport.user.id === req.user.id) {
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
