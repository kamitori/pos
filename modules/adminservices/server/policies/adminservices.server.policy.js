'use strict';

/**
 * Module dependencies
 */
var acl = require('acl');

// Using the memory backend
acl = new acl(new acl.memoryBackend());

/**
 * Invoke Adminservices Permissions
 */
exports.invokeRolesPolicies = function () {
  acl.allow([{
    roles: ['admin'],
    allows: [{
      resources: '/api/adminservices',
      permissions: '*'
    }, {
      resources: '/api/adminservices/saveimage',
      permissions: '*'
    }, {
      resources: '/api/adminservices/:adminserviceId',
      permissions: '*'
    }, {
      resources: '/api/adminservices/filterdata',
      permissions: '*'
    }, {
      resources: '/api/adminservices/getServiceByCompany/:companyIdService',
      permissions: '*'
    }]
  }, {
    roles: ['user'],
    allows: [{
      resources: '/api/adminservices',
      permissions: '*'
    }, {
      resources: '/api/adminservices/saveimage',
      permissions: '*'
    }, {
      resources: '/api/adminservices/filterdata',
      permissions: '*'
    }, {
      resources: '/api/adminservices/:adminserviceId',
      permissions: '*'
    }, {
      resources: '/api/adminservices/getServiceByCompany/:companyIdService',
      permissions: '*'
    }]
  }, {
    roles: ['guest'],
    allows: [{
      resources: '/api/adminservices',
      permissions: ['get']
    }, {
      resources: '/api/adminservices/:adminserviceId',
      permissions: ['get']
    }, {
      resources: '/api/adminservices/getServiceByCompany/:companyIdService',
      permissions: '*'
    }]
  }]);
};

/**
 * Check If Adminservices Policy Allows
 */
exports.isAllowed = function (req, res, next) {
  var roles = (req.user) ? req.user.roles : ['guest'];

  // If an Adminservice is being processed and the current user created it then allow any manipulation
  if (req.adminservice && req.user && req.adminservice.user && req.adminservice.user.id === req.user.id) {
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
