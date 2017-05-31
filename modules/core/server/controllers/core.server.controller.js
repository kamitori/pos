'use strict';

var validator = require('validator'),
  path = require('path'),
  config = require(path.resolve('./config/config')),
  mongoose = require('mongoose'),
  Company = mongoose.model('Company'),
  _ = require('lodash');
/**
 * Render the main application page
 */
exports.renderIndex = function (req, res) {
  var safeUserObject = null;
  if (req.user) {
    safeUserObject = Object.assign({}, req.user._doc);
    safeUserObject.roles = ['user'];
    if(!safeUserObject.company_list){
      safeUserObject.company_list = [safeUserObject.company_id];
    }
  }

  res.render('modules/core/server/views/index', {
    user: JSON.stringify(safeUserObject),
    sharedConfig: JSON.stringify(config.shared)
  });
};


/**
 * Render the admin module
 */
exports.renderAdmin = function (req, res) {
  var safeUserObject = null;
  var ObjectId = mongoose.Types.ObjectId;
  if (req.user) {
    Company.findOne({user: new ObjectId(req.user._id)}).exec(function(err, company) {
      if (err) {
        req.company = null;
      } else {
        req.company = company;
      }
      if (req.user) {
        safeUserObject = Object.assign({}, req.user._doc);
        safeUserObject.roles = ['user'];
        safeUserObject.company =  req.company;
      }
      res.render('modules/core/server/views/admin', {
        user: JSON.stringify(safeUserObject),
        sharedConfig: JSON.stringify(config.shared)
      });
    });
  } else {
    res.render('modules/core/server/views/admin', {
      user: JSON.stringify(safeUserObject),
      sharedConfig: JSON.stringify(config.shared)
    });
  }
};


exports.renderRestaurant = function (req, res) {
  var safeUserObject = null;
  if (req.user) {
    safeUserObject = Object.assign({}, req.user._doc);
    safeUserObject.roles = ['user'];
    safeUserObject.company =  null; // Thêm dòng này để chọn lại company
    if(!safeUserObject.company_list){
      safeUserObject.company_list = [safeUserObject.company_id];
    }
  }

  res.render('modules/core/server/views/index', {
    user: JSON.stringify(safeUserObject),
    sharedConfig: JSON.stringify(config.shared)
  });
};


/**
 * Render the server error page
 */
exports.renderServerError = function (req, res) {
  res.status(500).render('modules/core/server/views/500', {
    error: 'Oops! Something went wrong...'
  });
};

/**
 * Render the server not found responses
 * Performs content-negotiation on the Accept HTTP header
 */
exports.renderNotFound = function (req, res) {

  res.status(404).format({
    'text/html': function () {
      res.render('modules/core/server/views/404', {
        url: req.originalUrl
      });
    },
    'application/json': function () {
      res.json({
        error: 'Path not found'
      });
    },
    'default': function () {
      res.send('Path not found');
    }
  });
};
