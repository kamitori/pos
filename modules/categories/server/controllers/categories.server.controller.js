'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Category = mongoose.model('Category'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a Category
 */
exports.create = function(req, res) {
  var category = new Category(req.body);
  category.user = req.user;

  category.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(category);
    }
  });
};

/**
 * Show the current Category
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var category = req.category ? req.category.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  category.isCurrentUserOwner = req.user && category.user && category.user._id.toString() === req.user._id.toString();

  res.jsonp(category);
};

/**
 * Update a Category
 */
exports.update = function(req, res) {
  var category = req.category;

  category = _.extend(category, req.body);

  category.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(category);
    }
  });
};

/**
 * Delete an Category
 */
exports.delete = function(req, res) {
  var category = req.category;

  category.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(category);
    }
  });
};

/**
 * List of Categories
 */
exports.list = function(req, res) {
  Category.find({ setting_value: 'product_category' }).sort('-created').populate('user', 'displayName').exec(function(err, categories) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(categories);
    }
  });
};

exports.getList = function(req, res) {
  if(req.body.getListOptionType){
    Category.findOne({setting_value: 'product_option_type'}).populate('user', 'displayName').exec(function (err, results) {
      if (err) {
        return res.status(404).send({
          message: err
        });
      } else {
        var arr_tmp_group = [];
        results = JSON.parse(JSON.stringify(results));
        if(results.option) {
          results.option.forEach(function(_value, _key, _arr) {
            arr_tmp_group.push(_value.value);
          });
        }
        Category.find({ setting_value: { '$in': arr_tmp_group } }).populate('user', 'displayName').exec(function (err, groupsetting) {
          if (err) {
            return res.status(404).send({
              message: err
            });
          } else {
            var arr_setting = {}
            var arr_tmp_return = {};
            groupsetting = JSON.parse(JSON.stringify(groupsetting));
            for(var _keysetting in arr_tmp_group) {
              var setting = groupsetting[_keysetting];
              // res.jsonp(setting.option);
              for(var skey in setting.option) {
                var svalue = setting.option[skey];
                arr_setting[setting.setting_value] = arr_setting[setting.setting_value]?arr_setting[setting.setting_value]:[]
                arr_setting[setting.setting_value].push( { value:parseInt(svalue.value), label: svalue.name } );
              };
            };
            res.jsonp(arr_setting)
          }
        });
      }
    });
  }
};

/**
 * Category middleware
 */
exports.categoryByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Category is invalid'
    });
  }

  Category.findById(id).populate('user', 'displayName').exec(function (err, category) {
    if (err) {
      return next(err);
    } else if (!category) {
      return res.status(404).send({
        message: 'No Category with that identifier has been found'
      });
    }
    req.category = category;
    next();
  });
};
