(function () {
  'use strict';

  // Orders controller
  angular
    .module('orders')
    .controller('ProductOrdersController', ProductOrdersController)
    .controller('CartOrdersController', CartOrdersController)
    .controller('OrdersController', OrdersController);

  OrdersController.$inject = ['$scope', '$state','$http', '$window', 'Authentication', 'localStorageService', 'ModalService', 'CategoriesService', 'ProductsService', 'OrdersService'];

  function OrdersController ($scope, $state,$http, $window, Authentication, localStorageService, ModalService, CategoriesService, ProductsService, OrdersService) {
    var vm = this;
    var order_default = {
      deleted: false,
      delivery_method: '',
      invoice_address: [
        {
          deleted: false,
          shipping_address_1: '',
          shipping_address_2: '',
          shipping_address_3: '',
          shipping_town_city: '',
          shipping_zip_postcode: '',
          shipping_province_state_id: '',
          shipping_province_state: null,
          shipping_country: 'Canada',
          shipping_country_id: 'CA'
        }
      ],
      shipping_address: [
        {
          deleted: false,
          shipping_address_1: '',
          shipping_address_2: '',
          shipping_address_3: '',
          shipping_town_city: '',
          shipping_zip_postcode: '',
          shipping_province_state_id: '',
          shipping_province_state: null,
          shipping_country: 'Canada',
          shipping_country_id: 'CA'
        }
      ],
      cash_tend: 0,
      paid_by: '',
      pos_delay: '',
      time_delivery: new Date(),
      datetime_pickup: new Date(),
      order_type: 0,
      had_paid: 0,
      had_paid_amount: 0,
      pay_account_order: [],
      status: 'In production',
      status_id: 'In production',
      asset_status: 'In production',
      salesorder_date: new Date(),
      payment_due_date: new Date(),
      payment_terms: 0,
      sales_order_type: '',
      total_items: 0,
      job_id: '',
      job_name: '',
      job_number: '',
      quotation_id: '',
      quotation_name: '',
      quotation_number: '',
      customer_po_no: '',
      shipper: '',
      shipper_account: '',
      shipper_id: '',
      other_comment: '',
      completed: 0,
      voucher: '',
      taxper: 5,
      tax: 'AB',
      sum_amount: 0,
      sum_sub_total: 0,
      sum_tax: 0,
      discount_total: 0,
      voucher_value: 0,
      refund: 0,
      name: '',
      heading: 'Create from POS',
      create_from: 'Create from POS',
      products: []
    };
    vm.authentication = Authentication;
    // localStorageService.remove('order');
    vm.order = localStorageService.get('order')?localStorageService.get('order'):new OrdersService(order_default);
    localStorageService.set('order',vm.order);
    
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;
    vm.listGroupCategory = {};
    vm.listCategory = [];
    vm.listProduct = [];
    vm.listTag = [];
    vm.filterCategory = {};
    vm.popupProduct = popupProduct;
    vm.user = localStorageService.get('user');
    // console.log(vm.user);
    getListCategory();
    function getListCategory() {
      var service = CategoriesService.query().$promise;
      service.then(function (data) {
        vm.listCategory = data[0].option;
        vm.listCategory.forEach(function(value, key, arr) {
          if(value.group)
            vm.listGroupCategory[value.group] = value.group;
        });
        vm.filterCategory.group = 'Food';
        var group_elem = angular.element('#group-category li');
        for(var i = 0; i < group_elem.length; i++) {
          var elem = group_elem[i];
          elem.style.width = (100/group_elem.length) + '%';
        }
      });
    }

    function popupProduct(product) {
      ProductsService.getProduct({
        productIdProduct: product.id
      }).$promise.then(function(data) {
        data.quantity = 1;
        $http({
          method: 'PUT',
          url: '/api/categories',
          data: {
            getListOptionType: 1
          }
        }).then(function successCallback(response) {
          ModalService.showModal({
            templateUrl: 'modules/orders/client/views/modal-product.client.view.html',
            controller: 'ProductOrdersController',
            controllerAs: 'vm',
            inputs: {
              productPopup: JSON.parse(angular.toJson(data)),
              update: 0,
              optionType: JSON.parse(angular.toJson(response.data))
            }
          }).then(function(modal) {
            modal.element.modal();
            modal.element.on('hidden.bs.modal', function () {
              vm.order = localStorageService.get('order')?localStorageService.get('order'):new OrdersService(order_default);
              $scope.$apply();
            });
          });
            // this callback will be called asynchronously
            // when the response is available
          }, function errorCallback(response) {
            // called asynchronously if an error occurs
            // or server returns response with an error status.
        });
      });
    }

    function getProductOption(id) {
      return ProductsService.getProductOptions({
        productIdOption: id
      });
    }

    vm.loadProductFromCategory = loadProductFromCategory;
    function loadProductFromCategory(category_name) {
      $http({
        method: 'PUT',
        url: '/api/products',
        data: {
          categoryNameProduct: category_name
        }
      }).then(function successCallback(response) {
        vm.listProduct = response.data.product_list;
        vm.listTag = response.data.product_tag;
          // this callback will be called asynchronously
          // when the response is available
        }, function errorCallback(response) {
          // called asynchronously if an error occurs
          // or server returns response with an error status.
      });
    }

    // Remove existing Order
    function remove() {
      if ($window.confirm('Are you sure you want to delete?')) {
        vm.order.$remove($state.go('orders.list'));
      }
    }

    // Save Order
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.orderForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.order._id) {
        vm.order.$update(successCallback, errorCallback);
      } else {
        vm.order.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('orders.view', {
          orderId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }

    vm.clearCart = clearCart;
    function clearCart() {
      if ($window.confirm('Are you sure you want to clear cart?')) {
        localStorageService.remove('order');
        vm.order = localStorageService.get('order')?localStorageService.get('order'):new OrdersService(order_default);
        localStorageService.set('order',vm.order);
      }
    }

    vm.viewCart = viewCart;
    function viewCart() {
      ModalService.showModal({
        templateUrl: 'modules/orders/client/views/modal-cart.client.view.html',
        controller: 'CartOrdersController',
        controllerAs: 'vm',
        inputs: {
          order: vm.order
        }
      }).then(function(modal) {
        modal.element.modal();
        modal.element.on('hidden.bs.modal', function () {
          vm.order = localStorageService.get('order')?localStorageService.get('order'):new OrdersService(order_default);
          $scope.$apply();
        });
      });
    }
  }

  ProductOrdersController.$inject = ['$scope', '$state','$http', '$window', 'md5', 'Authentication', 'localStorageService', 'ModalService', 'ProductsService', 'productPopup', 'optionType', 'update'];

  function ProductOrdersController($scope, $state,$http, $window, md5, Authentication, localStorageService, ModalService, ProductsService, productPopup, optionType, update) {
    var vm = this;
    vm.update = update?update:0; 
    vm.order = localStorageService.get('order');
    vm.user = localStorageService.get('user');
    vm.product = JSON.parse(angular.toJson(productPopup));
    vm.product.op_description = vm.product.op_description?vm.product.op_description:{};
    vm.addCart = addCart;
    vm.groupOption = {};
    vm.levelOption = [];
    vm.level = 0;
    vm.optionType = optionType;
    vm.calPrice = calPrice;
    vm.calPrice();
    removeHashKey(vm.product);
    if(vm.product.options){
      vm.product.options.forEach(function(value, key) {
        var group = value.option_group?value.option_group:'all';
        var grouptokey = group.split('.').pop().trim().replace(' ',  '_').toLowerCase();
        var grouptoname = group.split('.').pop();
        if(value.level) {
          vm.groupOption[value.level] = vm.groupOption[value.level]?vm.groupOption[value.level]:{};
        }
        if(value.hidden != 1) {
          vm.groupOption[value.level][grouptokey] = grouptoname;
        }
        var keyLevel = 1;
        if(value.level){
          // keyLevel = parseInt(value.level.replace('Level ',''),10);
          if(vm.levelOption.indexOf(value.level) < 0) {
            vm.levelOption.push(value.level);
          }
        }
      });
      vm.currentLevel = vm.levelOption[Object.keys(vm.levelOption)[0]];
      vm.currentGroup = vm.groupOption[vm.currentLevel][Object.keys(vm.groupOption[vm.currentLevel])[0]];

    }
    console.log(vm.currentLevel);
    console.log(vm.currentGroup);
    vm.nextLevel = nextLevel;
    function nextLevel() {
      var current_key = 0;
      vm.levelOption.forEach(function(value, key) {
        if(value == vm.currentLevel){
          current_key = key;
        }
      })
      vm.currentLevel = vm.levelOption[current_key+1];
      vm.level = current_key+1;
      vm.currentGroup = vm.groupOption[vm.currentLevel][Object.keys(vm.groupOption[vm.currentLevel])[0]];
    }
    vm.backLevel = backLevel;
    function backLevel() {
      var current_key = 0;
      vm.levelOption.forEach(function(value, key) {
        if(value == vm.currentLevel){
          current_key = key;
        }
      })
      vm.currentLevel = vm.levelOption[current_key-1];
      vm.level = current_key-1;
      vm.currentGroup = vm.groupOption[vm.currentLevel][Object.keys(vm.groupOption[vm.currentLevel])[0]];
    }
    vm.downQuantity = downQuantity;
    vm.upQuantity = upQuantity;
    vm.changesize = changesize;
    function serialize (mixedValue) {
      var val, key, okey
      var ktype = ''
      var vals = ''
      var count = 0
      var _utf8Size = function (str) {
        var size = 0
        var i = 0
        var l = str.length
        var code = ''
        for (i = 0; i < l; i++) {
          code = str.charCodeAt(i)
          if (code < 0x0080) {
            size += 1
          } else if (code < 0x0800) {
            size += 2
          } else {
            size += 3
          }
        }
        return size
      }
      var _getType = function (inp) {
        var match
        var key
        var cons
        var types
        var type = typeof inp
        if (type === 'object' && !inp) {
          return 'null'
        }
        if (type === 'object') {
          if (!inp.constructor) {
            return 'object'
          }
          cons = inp.constructor.toString()
          match = cons.match(/(\w+)\(/)
          if (match) {
            cons = match[1].toLowerCase()
          }
          types = ['boolean', 'number', 'string', 'array']
          for (key in types) {
            if (cons === types[key]) {
              type = types[key]
              break
            }
          }
        }
        return type
      }
      var type = _getType(mixedValue)
      switch (type) {
        case 'function':
          val = ''
          break
        case 'boolean':
          val = 'b:' + (mixedValue ? '1' : '0')
          break
        case 'number':
          val = (Math.round(mixedValue) === mixedValue ? 'i' : 'd') + ':' + mixedValue
          break
        case 'string':
          val = 's:' + _utf8Size(mixedValue) + ':"' + mixedValue + '"'
          break
        case 'array':
        case 'object':
          val = 'a'
          /*
          if (type === 'object') {
            var objname = mixedValue.constructor.toString().match(/(\w+)\(\)/);
            if (objname === undefined) {
              return;
            }
            objname[1] = serialize(objname[1]);
            val = 'O' + objname[1].substring(1, objname[1].length - 1);
          }
          */
          for (key in mixedValue) {
            if (mixedValue.hasOwnProperty(key)) {
              ktype = _getType(mixedValue[key])
              if (ktype === 'function') {
                continue
              }
              okey = (key.match(/^[0-9]+$/) ? parseInt(key, 10) : key)
              vals += serialize(okey) + serialize(mixedValue[key])
              count++
            }
          }
          val += ':' + count + ':{' + vals + '}'
          break
        case 'undefined':
        default:
          // Fall-through
          // if the JS object has a property which contains a null value,
          // the string cannot be unserialized by PHP
          val = 'N'
          break
      }
      if (type !== 'object' && type !== 'array') {
        val += ';'
      }
      return val
    }
    vm.updateCart = updateCart;
    function updateCart(product) {
      removeHashKey(product);
      var keycart = md5.createHash(product._id+serialize(product.options));

      var check = true;
      for(var key in vm.order.products) {
        var value = vm.order.products[key];
        if(value['keycart'] == keycart) {
          vm.order.products[key]['quantity'] += product.quantity;
          for(var key2 in vm.order.products) {
            var value2 = vm.order.products[key2];
            if(value2['keycart'] == product.keycart && product.keycart != keycart) {
              delete vm.order.products[key2];
              var arr_tmp = [];
              for(var key3 in vm.order.products) {
                var value3 = vm.order.products[key3];
                arr_tmp.push(value3);
              }
              vm.order.products = arr_tmp;
              closeCart();
              check = false;
              break;
            }
          }
        }
      };
      if(check) {
        for(var key2 in vm.order.products) {
          var value2 = vm.order.products[key2];
          if(value2['keycart'] == product.keycart) {
            product.keycart = keycart;
            vm.order.products[key2] = Object.assign(product);
            closeCart();
            break;
          }
        };
      }
    }

    function addCart(product) {
      removeHashKey(product);
      var keycart = md5.createHash(product._id+serialize(product.options));
      product['keycart'] = keycart;
      if(vm.order.products.length > 0) {
        var check = true;
        for(var key in vm.order.products) {
        var value = vm.order.products[key];
          if(value['keycart'] == keycart) {
            vm.order.products[key]['quantity'] += product.quantity;
            closeCart();
            check = false;
            break;
          }
        }
        if(check) {
          vm.order.products.push(product);
          closeCart();
        }
      } else {
        vm.order.products.push(product);
        closeCart();
      }
    }

    function closeCart() {
      angular.element('.modal-product').modal('hide');
      reCalculateOrder();
    }

    function downQuantity(option, optiontype) {
      if(optiontype) {
        var min = 99;
        for(var key in optiontype) {
          var item = optiontype[key];
          if( min > parseInt(item.value) ) {
            min = item.value;
          }
        }
      } else {
        var min = 0;
      }

      option.quantity > min ? option.quantity = option.quantity - 1 : option.quantity = min;
      if(option.finish != undefined) {
        option.finish = option.quantity;
      }
      if(option.quantity != option.default_qty) {
        if(option.finish == undefined) {
          vm.product.op_description[option._id] = option.quantity + ' ' + option.name;
        } else {
          for(var key in optiontype) {
            var type = optiontype[key];
            if(type.value == option.quantity) {
              vm.product.op_description[option._id] = option.name + ' ' + '(' + type.label + ')' ;
            }
          }
        }
      } else {
        delete vm.product.op_description[option._id];
      }
      calPrice();
    }
    function upQuantity(option, optiontype) {
      if(optiontype) {
        var max = 0;
        for(var key in optiontype) {
          var item = optiontype[key];
          if( max < parseInt(item.value) ) {
            max = item.value;
          }
        }
      } else {
        var max = 99;
      }
              
      option.quantity < max ? option.quantity = option.quantity + 1 : option.quantity = max;

      if(option.finish != undefined) {
        option.finish = option.quantity;
      }

      if(option.quantity != option.default_qty) {
        if(option.finish == undefined) {
          vm.product.op_description[option._id] = option.quantity + ' ' + option.name;
        } else {
          for(var key in optiontype) {
            var type = optiontype[key];
            if(type.value == option.quantity) {
              vm.product.op_description[option._id] = option.name + ' ' + '(' + type.label + ')' ;
            }
          }
        }
      } else {
        delete vm.product.op_description[option._id];
      }
      calPrice();
    }
    function changesize(option) {
      if(option.group_type == 'Exc'){
        if(option.quantity) {
          option.quantity = 0;
          for(var key in vm.product.options) {
            var _option = vm.product.options[key];
            if(option.group_type == 'Exc' && _option.default_qty > 0){
              vm.product.options[key]['quantity'] = _option.default_qty;
            }
          }
        } else {
          for(var key in vm.product.options) {
            var _option = vm.product.options[key];
            if(_option.group_type == 'Exc'){
              vm.product.options[key]['quantity'] = 0;
              if(vm.product.options[key]['quantity'] == _option.default_qty){
                delete vm.product.op_description[_option._id];
              }
            }
          }
          option.quantity = 1;
        }
        if(option.quantity != option.default_qty) {
          vm.product.op_description[option._id] = option.name;
        } else {
          delete vm.product.op_description[option._id];
        }
      }
      calPrice();
    }
    function calPrice() {
      var sell_price = vm.product.unit_price;
      for(var key in vm.product.options) {
        var option = vm.product.options[key];
        if(option['sell_price']){
          if(option['adjustment']){
            sell_price += ( parseFloat(option['sell_price']) + parseFloat(option['adjustment']) ) * parseFloat(option['quantity']);
          }else{
            sell_price += parseFloat(option['sell_price']) * parseFloat(option['quantity']);
          }
        }
      }
      sell_price = Math.round(sell_price*100)/100;
      vm.product.sell_price = sell_price;
    }
    function removeHashKey(product) {
      for(var key in product.options) {
        var option = product.options[key];
        if(option['$$hashKey']){
          delete product.options[key]['$$hashKey'];
        }
      }
    }

    vm.changeQuantity = changeQuantity;
    function changeQuantity(optiontype) {
      for(var key in vm.product.options) {
        var option = vm.product.options[key];
        if(option.quantity != option.default_qty) {
          if(option.finish == undefined) {
            vm.product.op_description[option._id] = option.quantity + ' ' + option.name;
          } else {
            if(optiontype){
              for(var key in optiontype) {
                var type = optiontype[key];
                if(type.value == option.quantity) {
                  vm.product.op_description[option._id] = option.name + ' ' + '(' + type.label + ')' ;
                }
              }
            }
          }
        } else {
          delete vm.product.op_description[option._id];
        }
      }
    }

    function reCalculateOrder() {
      var sum_sub_total = 0;
      var sum_tax = 0;
      var sum_amount = 0;
      var total_items = 0;
      for(var key in vm.order.products) {
        total_items = total_items + parseInt(vm.order.products[key]['quantity']);
        var product = vm.order.products[key];
        if(vm.order.products[key]['$$hashKey']) {
          delete vm.order.products[key]['$$hashKey'];
        }
        sum_sub_total += product.sell_price * product.quantity;
      }
      sum_tax = (vm.order.taxper/100) * sum_sub_total;
      sum_amount = sum_tax + sum_sub_total;
      vm.order.total_items = total_items;
      vm.order.sum_sub_total = Math.round(sum_sub_total * 100)/100;
      vm.order.sum_tax = Math.round(sum_tax * 100)/100;
      vm.order.sum_amount = Math.round(sum_amount * 100)/100;
      localStorageService.set('order',vm.order);
      // $scope.$apply();
    }
  }

  CartOrdersController.$inject = ['$scope', '$state','$http', '$window', 'md5', 'Authentication', 'localStorageService', 'ModalService', 'order'];

  function CartOrdersController($scope, $state,$http, $window, md5, Authentication, localStorageService, ModalService, order) {
    var vm = this;
    vm.order = order?order:localStorageService.get('order')?localStorageService.get('order'):new OrdersService(order_default);

    vm.downQuantity = downQuantity;
    function reCalculateOrder() {
      var sum_sub_total = 0;
      var sum_tax = 0;
      var sum_amount = 0;
      var total_items = 0;
      for(var key in vm.order.products) {
        total_items = total_items + parseInt(vm.order.products[key]['quantity']);
        var product = vm.order.products[key];
        if(vm.order.products[key]['$$hashKey']) {
          delete vm.order.products[key]['$$hashKey'];
        }
        sum_sub_total += product.sell_price * product.quantity;
      }
      sum_tax = (vm.order.taxper/100) * sum_sub_total;
      sum_amount = sum_tax + sum_sub_total;
      vm.order.total_items = total_items;
      vm.order.sum_sub_total = Math.round(sum_sub_total * 100)/100;
      vm.order.sum_tax = Math.round(sum_tax * 100)/100;
      vm.order.sum_amount = Math.round(sum_amount * 100)/100;
      localStorageService.set('order',vm.order);
      // $scope.$apply();
    }

    function downQuantity(product) {
      product.quantity > 1 ? product.quantity = product.quantity - 1 : product.quantity = 1;
      reCalculateOrder();
    }

    vm.upQuantity = upQuantity;
    function upQuantity(product) {
      product.quantity < 99 ? product.quantity = product.quantity + 1 : product.quantity = 99;
      reCalculateOrder();
    }

    vm.editProduct = editProduct;
    function editProduct(product) {
      $http({
        method: 'PUT',
        url: '/api/categories',
        data: {
          getListOptionType: 1
        }
      }).then(function successCallback(response) {
        ModalService.showModal({
          templateUrl: 'modules/orders/client/views/modal-product.client.view.html',
          controller: 'ProductOrdersController',
          controllerAs: 'vm',
          inputs: {
            productPopup: product,
            optionType: JSON.parse(angular.toJson(response.data)),
            update: 1
          }
        }).then(function(modal) {
          modal.element.modal();
          modal.element.on('hidden.bs.modal', function () {
            vm.order = localStorageService.get('order')?localStorageService.get('order'):new OrdersService(order_default);
            $scope.$apply();
          });
        });
          // this callback will be called asynchronously
          // when the response is available
        }, function errorCallback(response) {
          // called asynchronously if an error occurs
          // or server returns response with an error status.
      });
    }

    vm.deleteProduct = deleteProduct;
    function deleteProduct(product) {
      if ($window.confirm('Are you sure you want to delete?')) {
        for(var key in vm.order.products) {
          var value = vm.order.products[key];
          if(value['keycart'] == product.keycart) {
            delete vm.order.products[key];
            var arr_tmp = [];
            for(var key2 in vm.order.products) {
              var value2 = vm.order.products[key2];
              arr_tmp.push(value2);
            }
            vm.order.products = arr_tmp;
            reCalculateOrder();
          }
        };
      }
    }
  }
}());
