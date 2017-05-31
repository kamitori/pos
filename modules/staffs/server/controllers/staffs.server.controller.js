'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Staff = mongoose.model('Staff'),
  multer = require('multer'),  
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');
 var crypto = require('crypto');
// var CryptoJS = require("crypto-js");
var _key = '123456';
var Services = mongoose.model('Adminservice');
var Tbworkinghour = mongoose.model('Tbworkinghour');
var storage = multer.diskStorage({
  destination: function(req, file, callback) {
    callback(null, './public/img/staffs/');
  },
  filename: function (req, file, callback) {
    var d = new Date();
    var datetimestamp = d.getMonth() + '-' + d.getDate() + '-' + d.getFullYear();
    var new_name = file.originalname.split('.')[0] + '-' + datetimestamp + '.' + file.originalname.split('.')[file.originalname.split('.').length - 1];
    callback(null, new_name);
  }
});

var upload = multer(
  { storage: storage }
).single('file');

/**
 * Create a Staff
 */
exports.create = function(req, res) {
  var staff = new Staff(req.body);
  staff.user = req.user;

  staff.save(function(err) {
    if (err) {
      return res.status(405).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(staff);
    }
  });
};

/**
 * Show the current Staff
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var staff = req.staff ? req.staff.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  staff.isCurrentUserOwner = req.user && staff.user && staff.user._id.toString() === req.user._id.toString();

  res.jsonp(staff);
};

/**
 * Update a Staff
 */
exports.update = function(req, res) {
  var staff = req.staff;
  staff = _.extend(staff, req.body);
  staff.markModified('services');
  staff.save(function(err) {
    if (err) {
      return res.status(405).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(staff);
    }
  });
};

/**
 * Delete an Staff
 */
exports.delete = function(req, res) {
  var staff = req.staff;

  staff.remove(function(err) {
    if (err) {
      return res.status(405).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(staff);
    }
  });
};

/**
 * List of Staffs
 */
exports.list = function(req, res) {	
  Staff.find({
    'full_name' : {'$exists': true}    
    ,'is_employee': 1
    ,'deleted': false
  }).sort('full_name').exec(function(err, staffs) {
    if (err) {
      return res.status(405).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(staffs);
    }
  });
};
exports.uploadimage = function(req, res, next) {
  upload(req, res, function(err) {
    if (err) {
      return res.end('Error uploading file: ' + errorHandler.getErrorMessage(err));
    }
  });
  res.json({ message: 'ok' });
};
exports.getworkinghoursdata = function(req, res) {
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
    var id = '';
    if (_data.id) id = _data.id;
    
    // if (mongoose.Types.ObjectId.isValid(id)) {
      
    // }
    // res.jsonp('cannot find data ' + new mongoose.Types.ObjectId(id));
    var _date = new Date();    
    var _month = _date.getMonth() + 1;
    if (_month < 12) {
      _month = _month.toString();
      _month = '0' + _month;
    }else {
      _month = _month.toString();
    }    
    var _year = _date.getFullYear();
    _year = _year.toString();    
    var _month_year = _year + _month;
    if (_data._date) {
      var _dates = _data._date;
      var _arr = _dates.split('-');
      _month_year = _arr[0] + _arr[1];
    }
    _month_year = parseInt(_month_year, 10);
    Tbworkinghour.find({
      'contact_id': new mongoose.Types.ObjectId(id),
      'deleted': false,
      'year_month': _month_year
    }).exec(function (err, tbworkinghour) {
      if (err) {
        return res.send('error = ' + id);
      }
      res.jsonp(tbworkinghour);
    });
  }
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

    var staff = new Staff(req.body);
    staff.full_name = _data.name;
    staff.email = _data.email;
    staff.is_employee = 1;
    staff.deleted = 0;
    staff.password = _data.password;
    staff.change_pass_first_login = _data.first_login;
    staff.services = {};
    // staff.staffid = CryptoJS.AES.encrypt(staff.name, _key);
    staff.user = req.user;

    staff.save(function(err) {
      if (err) {
        return res.status(405).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else {
        res.jsonp(staff);
      }
    });

  }
};

exports.getlistservice = function(req, res) {
  Services.find().exec(function (err, service) {
    if (err) {
      return res.send('error');
    } else if (!service) {
      return res.status(404).send({
        message: 'No Service found'
      });
    }
    res.jsonp(service);
  });
};
/**
 * Staff middleware
 */
exports.staffByID = function(req, res, next, id) {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(405).send({
      message: 'Staff is invalid'
    });
  }
  Staff.findById(id).populate('user', 'displayName').exec(function (err, staff, Services) {
    if (err) {
      return next(err);
    } else if (!staff) {
      return res.status(404).send({
        message: 'No Staff with that identifier has been found'
      });
    }
    req.staff = staff;
    next();
  });
};

/**
 * Get Staff By Company ID
 */
exports.staffByCompany = function(req, res, next, companyIdStaff) {
  if(companyIdStaff === undefined){
    next();
  }else{
    if (!mongoose.Types.ObjectId.isValid(companyIdStaff)) {
      return res.status(405).send({
        message: 'Company is invalid'
      });
    }
    Staff.find({'company': new mongoose.Types.ObjectId(companyIdStaff) }).exec(function (err, staffs, Services) {
      if (err) {
        return next(err);
      } else if (!staffs) {
        return res.status(404).send({
          message: 'No Staff with that identifier has been found'
        });
      }
      req.staffs = staffs;
      if(req.body._id){
        var id = req.body._id;
        if (!mongoose.Types.ObjectId.isValid(id)) {
          return res.status(405).send({
            message: 'Staff is invalid'
          });
        }
        Staff.findById(id).populate('user', 'displayName').exec(function (err, staff, Services) {
          if (err) {
            return next(err);
          } else if (!staff) {
            return res.status(404).send({
              message: 'No Staff with that identifier has been found'
            });
          }
          req.staff = staff;
          next();
        });
      }else{
        next();
      }
    });
  }
}

exports.getStaffByCompany = function(req, res) {
  // convert mongoose document to JSON
  res.jsonp(req.staffs);
};

exports.updateStaffFromCompany = function(req, res) {
  var staff = req.staff;
  staff = _.extend(staff, req.body);
  staff.markModified('services');

  // var step1 = crypto.createHash('md5').update(password).digest("hex");
  // staff.password = crypto.createHash('md5').update(step1+this._id).digest("hex");

  staff.save(function(err) {
    if (err) {
      return res.status(405).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(staff);
    }
  });
}

exports.deleteStaffFromCompany = function(req, res) {
  var staff = req.staff;

  staff.remove(function(err) {
    if (err) {
      return res.status(405).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(staff);
    }
  });
}
