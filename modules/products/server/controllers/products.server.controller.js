'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  ksort = require('ksort'),
  Product = mongoose.model('Product'),
  Category = mongoose.model('Category'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a Product
 */
exports.create = function(req, res) {
  var product = new Product(req.body);
  product.user = req.user;

  product.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(product);
    }
  });
};

/**
 * Show the current Product
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var product = req.product ? req.product.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  product.isCurrentUserOwner = req.user && product.user && product.user._id.toString() === req.user._id.toString();

  res.jsonp(product);
};

/**
 * Update a Product
 */
exports.update = function(req, res) {
  var product = req.product;

  product = _.extend(product, req.body);

  product.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(product);
    }
  });
};

/**
 * Delete an Product
 */
exports.delete = function(req, res) {
  var product = req.product;

  product.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(product);
    }
  });
};

/**
 * List of Products
 */
exports.list = function(req, res) {
  Product.find().sort('-created').populate('user', 'displayName').exec(function(err, products) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(products);
    }
  });
};

/**
 * List of Products
 */
exports.getList = function(req, res) {
  if(req.body.categoryNameProduct) {
    var conditions = {
      category: req.body.categoryNameProduct,
      deleted: false,
      assemply_item: 1,
      status: 1
    }
    var product_list = [];
    var product_id = [];
    var product_tag = {};
    product_tag['All'] = 'All';
    var arr_have_price = [];
    var arr_opid = [];
    Product.find(conditions).sort('-name').populate('user', 'displayName').exec(function(err, products) {
      if (err) {
        return res.status(400).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else {
        products.forEach(function(value, key, array) {
          value = JSON.parse(JSON.stringify(value));
          product_list[key] = {};
          product_list[key]['name'] = value.name;
          product_list[key]['description'] = value.description || '';
          product_list[key]['product_desciption'] = value.product_desciption || '';
          product_list[key]['id'] = value._id;
          product_list[key]['price'] = parseFloat(value.sell_price).toFixed(2);
          product_list[key]['image'] = '';
          product_list[key]['category_id'] = value.category;
          product_list[key]['combo'] = value.category == 'Sub Combo'?1:0;
          product_list[key]['use_group_order'] = value.use_group_order?value.use_group_order:0;
          product_list[key]['combo_sales'] = value.combo_sales?parseFloat(value.combo_sales):1;
          if(value.product_base) {
            product_list[key]['tag'] = value.product_base;
            product_tag[value.product_base] = value.product_base;
          } else {
            product_list[key]['tag'] = 'Other';
          }
          product_list[key]['custom'] = 0;
          if((value.pricebreaks && value.pricebreaks.length) || (value.options && value.options.length)) {
            product_list[key]['custom'] = 1;
          }

          if(value.products_upload){
            product_list[key]['image'] = value.products_upload;
            value.products_upload.forEach(function(value1, key1, array1) {
              if(value1.deleted == false && value1.path) {
                product_list[key]['image'] = 'http://jt.banhmisub.com'+value1.path;
              }
            })
          }
        }); //enf for products
        product_tag['Other'] = 'Other';
        res.jsonp({
          product_list: product_list,
          product_tag: product_tag
        })
      }
    });
  }

  if(req.body.productIdOption) {
    if (!mongoose.Types.ObjectId.isValid(req.body.productIdOption)) {
      return res.status(400).send({
        message: 'Product is invalid'
      });
    }else{
      Product.findById(req.body.productIdOption).populate('user', 'displayName').exec(function (err, product) {
        if (err) {
          return res.status(404).send({
            message: err
          });
        } else if (!product) {
          return res.status(404).send({
            message: 'No Product with that identifier has been found'
          });
        }
        var option = {};
        var arr_proid = [];
        var arr_group = {};
        var arr_pro = {};
        var is_default = {};
        var arr_group_product = {};
        var finish_option = {};
        var option_price_total = 0;
        var max_choice = 0;
        var description = '';
        if(product.maximum_option) {
          max_choice = product.maximum_option;
        }
        if(product.options && product.options.length) {
          product.options.forEach(function(value, key, arr) {
            if(!value.hidden) {
              value.hidden = 0;
            }
            if(!value.default) {
              value.default = 0;
            }
            if(value.deleted == false && value.hidden != 1) {
              value.key = key;
              var group = value.option_group?value.option_group:'all';
              var grouptokey = group.split('.').pop().trim().replace(' ',  '_').toLowerCase();
              var grouptoname = group.split('.').pop();
              if(!value.require || value.require == 0)
                value.quantity = 0;
              if(value.finish)
                value.quantity = parseInt(value.finish);
              value.default_qty = value.quantity;
              if(!value.level)
                value.level = 'Level 01';
              if(!value.group_order)
                value.group_order = 1;

              arr_group[value.level] = arr_group[value.level]?arr_group[value.level]:{};
              arr_group[value.level][grouptokey] = arr_group[value.level][grouptokey]?arr_group[value.level][grouptokey]:{};
              arr_group[value.level][grouptokey]['label'] = grouptoname;
              arr_group[value.level][grouptokey]['order'] = parseInt(value.group_order);
              group = grouptokey;
              option[value.level] = option[value.level]?option[value.level]:{};
              option[value.level][group] = option[value.level][group]?option[value.level][group]:{};
              option[value.level][group][value.product_id] = value;
              option[value.level][group][value.product_id]['product_id'] = value.product_id;
              arr_proid.push(mongoose.Types.ObjectId(value.product_id));
              arr_group_product[value.product_id] = group;
              if(value.default == 1 && value.finish && value.finish == 1) {
                is_default[value.product_id] = 1;
              }
            }
          });

          var query = {
            '_id': {
              '$in': arr_proid
            }
          }
          Product.find(query).populate('user', 'displayName').exec(function (err, optionsProduct) {
            if (err) {
              return res.status(404).send({
                message: err
              });
            } else {
              optionsProduct = JSON.parse(JSON.stringify(optionsProduct));
              optionsProduct.forEach(function(value, key, arr) {
                value.image = '';
                if(value.products_upload && value.products_upload.length) {
                  value.products_upload.forEach(function(v, k, a) {
                    if(v.deleted == false) {
                      value.image = 'http://jt.banhmisub.com' + v.path;
                    }
                  })
                }
                var id = value._id;
                if(value.option_type) {
                  arr_pro[id] = value.option_type;
                } else {
                  value.option_type = '';
                }
                if(is_default[id]) {
                  description += '<p id="od_'+id+'">'+value.name+' (<b>'+'Yes'+'</b>) </p>';
                }
                for(var level in option){
                  option[level] = option[level]?option[level]:{};

                  option[level][arr_group_product[id]] = option[level][arr_group_product[id]]?option[level][arr_group_product[id]]:{};

                  if(option[level][arr_group_product[id]][id]) {
                    option[level][arr_group_product[id]][id] = _.extend(value, option[level][arr_group_product[id]][id]);
                    var item = _.extend({}, option[level][arr_group_product[id]][id]);
                    var adjustment = 0;
                    if(item.adjustment != undefined){
                      adjustment = item.adjustment;
                    }
                    option_price_total += item.quantity * (item.sell_price + adjustment); 
                  }
                }
              });
              option = ksort(option, function(a, b) {
                return a[value.level] < b[value.level];
              });
              arr_group = ksort(arr_group, function(a, b) {
                return a[value.level] < b[value.level];
              });
              var temp = {};
              var tmpgroup = {};
              for(var _key in arr_group) {
                var _value = arr_group[_key];
                _value = ksort(_value, function(a, b) {
                  return a.order < b.order;
                });
                arr_group[_key] = _value;
                for(var _kk in _value) {
                  var _vv = _value[_kk];
                  if(option[_key][_kk]){
                    option[_key][_kk] = ksort(option[_key][_kk], function(a, b) {
                      return b.name <= a.name
                    });
                  }
                  temp[_key] = temp[_key]?temp[_key]:{};
                  temp[_key][_kk] = _.extend({}, option[_key][_kk]);
                  tmpgroup[_key] = tmpgroup[_key]?tmpgroup[_key]:{};
                  tmpgroup[_key][_kk] = _vv.label;
                };
              };
              option = temp;
              arr_group = tmpgroup;
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
                          arr_setting[setting.setting_value] = arr_setting[setting.setting_value]?arr_setting[setting.setting_value]:{}
                          arr_setting[setting.setting_value][svalue.value] = svalue.name
                        };
                      };

                      for(var skey in arr_pro) {
                        var svalue = arr_pro[skey];
                        if(arr_setting[svalue]){
                          arr_tmp_return[skey] = arr_setting[svalue]
                        }
                      };
                      finish_option = arr_tmp_return;
                      res.jsonp({
                        'arr_group': arr_group,
                        'option': option,
                        'option_price_total': option_price_total,
                        'cart_id': '',
                        'finish_option': arr_tmp_return,
                        'max_choice': max_choice,
                        'description': description,
                        'choice_default_amout': is_default.length
                      })
                    }
                  });
                }
              });
            }
          });
        }
      });
    }
  }

  if(req.body.productIdProduct) {
    var id = req.body.productIdProduct;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).send({
        message: 'Product is invalid'
      });
    }

    Product.findById(id).populate('user', 'displayName').exec(function (err, product) {
      if (err) {
        return next(err);
      } else if (!product) {
        return res.status(404).send({
          message: 'No Product with that identifier has been found'
        });
      }
      var arr_option_id = [];
      product = JSON.parse(JSON.stringify(product));
      product.image = '';
      for(var key in product.products_upload) {
        var value = product.products_upload[key];
        if(value.deleted == false) {
          product.image = value.path;
        }
      }
      delete product.created;
      if(product.image) {
        delete product.products_upload;
      }
      if(product.options){
        for(var key in product.options) {
          var value = product.options[key];
          if(value.deleted == false)
            arr_option_id.push(mongoose.Types.ObjectId(value.product_id));
        };
        var query = {
          '_id': {
            '$in': arr_option_id
          },
          deleted: false,
          product_type: 'Options'
        }
        Product.find(query).populate('user', 'displayName').exec(function (err, options) {
          if (err) {
            return next(err);
          } else {
            var arr_option = [];
            options = JSON.parse(JSON.stringify(options));

            for(var key in product.options) {
              var value = product.options[key];

              if(!value.require || value.require == 0)
                value.quantity = 0;

              if(value.finish != undefined)
                value.quantity = parseInt(value.finish)?parseInt(value.finish):0;

              if(!value.quantity) {
                value.quantity = 0;
              } else {
                value.quantity = parseInt(value.quantity);
              }

              value.default_qty = value.quantity;
              for(var key2 in options) {
                var value2 = options[key2];
                for(var key3 in value2.products_upload) {
                  var value3 = value2.products_upload[key3];
                  // console.log(value3);
                  if(value3.deleted == false) {
                    value2.image = value3.path;
                  }
                }
                delete value2.created;
                if(value2.image){
                  delete value2.products_upload;
                }

                if(value.product_id == value2._id && value.deleted == false){
                  var arr_tmp = _.merge({},value2,value);
                  arr_option.push(arr_tmp);
                }
              }
            }
            product.options = arr_option;
            res.jsonp(product);
          }
        })
      } else {
        res.jsonp(product);
      }
    });
  }
};

/**
 * Product middleware
 */
exports.productByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Product is invalid'
    });
  }

  Product.findById(id).populate('user', 'displayName').exec(function (err, product) {
    if (err) {
      return next(err);
    } else if (!product) {
      return res.status(404).send({
        message: 'No Product with that identifier has been found'
      });
    }
    req.product = product;
    next();
  });
};
