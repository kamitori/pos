'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  multer = require('multer'),
  Adminservice = mongoose.model('Adminservice'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

var uploadFolder = path.resolve(__dirname, '../../../public/img');
var new_name = 'noname';
var storage = multer.diskStorage({
  destination: function(req, file, callback) {
    callback(null, './public/img/services/');
  },
  filename: function (req, file, callback) {
    var d = new Date();
    var datetimestamp = d.getMonth() + '-' + d.getDate() + '-' + d.getFullYear();
    new_name = file.originalname.split('.')[0] + '-' + datetimestamp + '.' + file.originalname.split('.')[file.originalname.split('.').length - 1];
    callback(null, new_name);
  }
});

var upload = multer(
  { storage: storage }
  // ,{
  //   limits : {fieldNameSize : 20}
  // }
).single('file');

/**
 * Create a Adminservice
 */
exports.filterdata = function(req, res) {
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
    var _filter = _data.name;
    var _where = {};
    if (_filter !='') _where = {
      'cate_type': _filter
    };
    Adminservice.find(_where).sort('name').populate('user', 'displayName').exec(function(err, adminservices) {
      if (err) {
        return res.status(405).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else {
        res.jsonp(adminservices);
      }
    });
  }
};

exports.create = function(req, res) {
  var adminservice = new Adminservice(req.body);
  adminservice.user = req.user;
  // if(adminservice.staffs.length){
  //   var arr_staffs = [];
  //   for(var i = 0; i < adminservice.staffs.length; i++) {
  //     var id = adminservice.staffs[i].id;
  //     if (mongoose.Types.ObjectId.isValid(id)) {
  //       arr_staffs.push(mongoose.Types.ObjectId(id));
  //     }
  //   }
  //   adminservice.staffs = arr_staffs;
  // }
  adminservice.save(function(err) {
    if (err) {
      return res.status(405).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(adminservice);
    }
  });
};

/**
 * Show the current Adminservice
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var adminservice = req.adminservice ? req.adminservice.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the 'owner'.
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  adminservice.isCurrentUserOwner = req.user && adminservice.user && adminservice.user._id.toString() === req.user._id.toString();

  res.jsonp(adminservice);
};

/**
 * Update a Adminservice
 */
exports.update = function(req, res) {

  var adminservice = req.adminservice;

  adminservice = _.extend(adminservice, req.body);

  adminservice.save(function(err) {
    if (err) {
      return res.status(405).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(adminservice);
    }
  });
};

/**
 * Delete an Adminservice
 */
exports.delete = function(req, res) {
  var adminservice = req.adminservice;

  adminservice.remove(function(err) {
    if (err) {
      return res.status(405).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(adminservice);
    }
  });
};

/**
 * List of Adminservices
 */
exports.list = function(req, res) {
  Adminservice.find().sort('name').populate('user', 'displayName').exec(function(err, adminservices) {
    if (err) {
      return res.status(405).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(adminservices);
    }
  });
};
/*
*upload image
*/
exports.uploadimage = function(req, res, next) {
  upload(req, res, function(err) {
    if (err) {
      return res.end('Error uploading file: ' + errorHandler.getErrorMessage(err));
    }
  });
  res.json({ message: req.body.new_file_name });
};
/**
 * Adminservice middleware
 */
exports.adminserviceByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(405).send({
      message: 'Adminservice is invalid' + id
    });
  }
  Adminservice.findById(id).populate('user', 'displayName').exec(function (err, adminservice) {
    if (err) {
      return next(err);
    } else if (!adminservice) {
      return res.status(404).send({
        message: 'No Adminservice with that identifier has been found'
      });
    }
    req.adminservice = adminservice;
    next();
  });
};


/**
 * Get Service By Company ID
 */
exports.ServiceByCompany = function(req, res, next, companyId) {
  if(companyId === undefined){
    next();
  }else{
    if (!mongoose.Types.ObjectId.isValid(companyId)) {
      return res.status(405).send({
        message: 'Company is invalid'
      });
    }
    Adminservice.find({'company': new mongoose.Types.ObjectId(companyId) }).exec(function (err, adminservices, Services) {
      if (err) {
        return next(err);
      } else if (!adminservices) {
        return res.status(404).send({
          message: 'No Service with that identifier has been found'
        });
      }
      // for(var i = 0; i < adminservices.length; i++){
      //   if(adminservices[i].staffs.length){
      //     var arr_staffs = [];
      //     for (var j = 0; j < adminservices[i].staffs.length; j++) {
      //       arr_staffs.push({ id: adminservices[i].staffs[j] })
      //     }
      //     adminservices[i].staffs = arr_staffs;
      //   }
      // }
      req.adminservices = adminservices;
      
      if(req.body._id){
        var id = req.body._id;
        if (!mongoose.Types.ObjectId.isValid(id)) {
          return res.status(405).send({
            message: 'Service is invalid'
          });
        }
        Adminservice.findById(id).populate('user', 'displayName').exec(function (err, adminservice, Services) {
          if (err) {
            return next(err);
          } else if (!adminservice) {
            return res.status(404).send({
              message: 'No Service with that identifier has been found'
            });
          }
          req.adminservice = adminservice;
          next();
        });
      }else{
        next();
      }
    });
  }
}

exports.getServiceByCompany = function(req, res) {
  // convert mongoose document to JSON
  res.jsonp(req.adminservices);
};

exports.updateServiceFromCompany = function(req, res) {
  var adminservice = req.adminservice;
  adminservice = _.extend(adminservice, req.body);
  adminservice.markModified('services');
  adminservice.save(function(err) {
    if (err) {
      return res.status(405).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(adminservice);
    }
  });
}

exports.deleteServiceFromCompany = function(req, res) {
  var adminservice = req.adminservice;
  adminservice.remove(function(err) {
    if (err) {
      return res.status(405).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(adminservice);
    }
  });
};