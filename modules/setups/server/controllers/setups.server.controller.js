'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Setup = mongoose.model('Setup'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');
var qs = require('querystring');
/**
 * Create a Setup
 */
exports.create = function(req, res) {
  var setup = new Setup(req.body);
  setup.user = req.user;

  setup.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(setup);
    }
  });
};

/**
 * Show the current Setup
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var setup = req.setup ? req.setup.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  setup.isCurrentUserOwner = req.user && setup.user && setup.user._id.toString() === req.user._id.toString();

  res.jsonp(setup);
};

/**
 * Update a Setup
 */
exports.update = function(req, res) {
  var setup = req.setup;

  setup = _.extend(setup, req.body);

  setup.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(setup);
    }
  });
};

/**
 * Delete an Setup
 */
exports.delete = function(req, res) {
  var setup = req.setup;

  setup.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(setup);
    }
  });
};

/**
 * List of Setups
 */
exports.list = function(req, res) {
  Setup.find({
    'type': 'module',
    'module_name': 'notification'
  }).sort('orderno').exec(function(err, setups) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      if (setups.length == 0) {
        var setup = new Setup(req.body);
        setup.user = req.user;
        setup.type = 'module';
        setup.module_name = 'notification';
        setup.save(function(err) {
          if (err) {
            return res.status(400).send({
              message: errorHandler.getErrorMessage(err)
            });
          } else {
            res.jsonp(setup);
          }
        });
      } else {
        res.jsonp(setups);  
      }
    }
  });
};

/**
 * Setup middleware
 */
exports.setupByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Setup is invalid'
    });
  }

  Setup.findById(id).populate('user', 'displayName').exec(function (err, setup) {
    if (err) {
      return next(err);
    } else if (!setup) {
      return res.status(404).send({
        message: 'No Setup with that identifier has been found'
      });
    }
    req.setup = setup;
    next();
  });
};
exports.quicksavedata = function(req, res) {
  var post = '';
  var _setup = '';
  if (req.method === 'POST') {
    var body = req.body;
    if (body.length > 1e6) {
      req.connection.destroy();
    }
    var _temp = '';
    for (var key in body) {
      if (body.hasOwnProperty(key)) {
        _temp = key.toString();
      }
    }
    var _data = JSON.parse(_temp);
    var _id = _data.alias;
    var _option_key = _data.key;
    var _val = _data.value;
    Setup.findById(_id).exec(function (err, setup) {
      if (err) {
        res.send('error');
      } else if (!setup) {
        return res.status(404).send({
          message: 'No Setup with that identifier has been found'
        });
      }
      _setup = setup;
      var _temp = '';
      try {        
        setup[_option_key] = _val;
        setup.save(function(err, next) {
          if (err) {
            return res.status(400).send({
              message: errorHandler.getErrorMessage(err)
            });
          } else {
            res.status(200).send({
              message: 'ok'
            });
          }
        });
      } catch (ex) {
        res.send(ex);
      }
    });
  }
};
