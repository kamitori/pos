(function () {
  'use strict';

  var app = angular
    .module('salesreports')
    .controller('SalesreportsListController', SalesreportsListController)
    .factory('Excel', function($window) {
	    var uri = 'data:application/vnd.ms-excel;base64,';
	    var template = '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40"><head><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>{worksheet}</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]--></head><body><table>{table}</table></body></html>';
	    var base64 = function (s) {
	      return $window.btoa(unescape(encodeURIComponent(s)));
	    };
	    var format = function (s, c) {
	      return s.replace(/{(\w+)}/g, function (m, p) {
	        return c[p];
	      });
	    };
	    return {
	      tableToExcel: function (tableId, worksheetName) {
	        var table = $(tableId);
	        var ctx = {
	          worksheet: worksheetName,
	          table: table.html()
	        };
	        var href = uri + base64(format(template, ctx));
	        return href;
	      }
	    };
  	});
    

  SalesreportsListController.$inject = ['SalesreportsService', '$scope', '$rootScope', 'uiGridConstants', '$http', 'Notification', 'Excel', '$timeout', 'uiGridExporterConstants'];

  function SalesreportsListController(SalesreportsService, $scope, $rootScope, uiGridConstants, $http, Notification, Excel, $timeout, uiGridExporterConstants) {
    var vm = this;
    vm.salesreports = [];
    vm.reloadData = function () {
    	$http({
	      method: 'POST',
	      url: '/api/salesreports/getdata',
	      data: {
	        'id': vm.query_start_date
	      },
	      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
	    }).success(function(data, status, headers, config) {
  	    vm.total_instore = 0;
		    vm.total_online = 0;
		    vm.total_delivery = 0;
		    vm.total_amount = 0;
		    vm.total_purchase_order_price = 0;
	    	for(var item in data) {
	    		if (data[item].heading === 'Create from POS') {
	    			vm.total_instore += parseFloat(data[item].sum_amount);
	    		} else if (data[item].heading === 'online') {
	    			vm.total_online += parseFloat(data[item].sum_amount);
	    		} else if (data[item].heading === 'delievry') {
	    			vm.total_delivery += parseFloat(data[item].sum_amount);
	    		}
	    	}
	    	vm.total_amount = (vm.total_instore + vm.total_online + vm.total_delivery).formatMoney(2);
	    	vm.total_instore = (vm.total_instore).formatMoney(2);
	    	vm.total_online = (vm.total_online).formatMoney(2);
	    	vm.total_delivery = (vm.total_delivery).formatMoney(2);
	    	vm.gridOptions.data = data;
	    	vm.gridApi.core.refresh();
	    }).error(function(data, status, headers, config) {
	      Notification.error({ message: '<i class="glyphicon glyphicon-ok"></i> Error on getting data' });
	    });
    };    
    vm.searchGrid = function(){
	    vm.gridApi.grid.columns[0].filters[0].term = $scope.search_order;
	  }
	  vm.search_order = function () {	  	
	  };
    vm.gridOptions = {
    	onRegisterApi: function( gridApi ) {
    		vm.gridApi = gridApi;	      
	    },	    
	    paginationPageSizes: [10, 25, 50, 75],
    	paginationPageSize: 10,
	    columnDefs: [	      
	      {
	      	field: 'code',
	      	'name': 'SO/PO',
	      	cellTemplate: '<p><i class="fa fa-play" aria-hidden="true" style="cursor: pointer"></i>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{{row.entity.code}}</p>',
	      },
	      { 
	      	field: 'sum_sub_total',
	      	name: 'Amount',
	      	cellTemplate: '<span>${{(row.entity.sum_sub_total).formatMoney(2)}}</span>',
	      	cellFilter: 'formatNumber:2',
	      },
	      { field: 'heading', name: 'Heading' },
	      {
	      	field: 'sum_tax',
	      	name: 'Tax(5%)',
	      	cellTemplate: '<span>${{(row.entity.sum_tax).formatMoney(2)}}</span>',
	      	cellFilter: 'formatNumber:2',
	      },
	      { 
	      	field: 'cart.discount_total',
	      	name: 'Discount',
	      	cellTemplate: '<span>${{(row.entity.cart.discount_total).formatMoney(2)}}</span>',
	      	cellFilter: 'formatNumber:2',
	      },
	      { field: 'cart.voucher_value', name: 'Coupon' },
	      { field: 'job_number', name: 'Job' },
	      { 
	      	field: 'sum_amount', 
	      	name: 'Total',
	      	cellTemplate: '<span>${{row.entity.sum_amount}}</span>',
	      	cellFilter: 'formatNumber:2',
	    	},
	    ],
	    enableFiltering: true,
	    enableRowHashing:false,
	    enableSorting: true,
	    enablePaginationControls: true,
      enableGridMenu: true,
      enableSelectAll: true,
      exporterCsvFilename: 'listSaleOrders.csv',
      exporterPdfDefaultStyle: { fontSize: 9 },
      exporterPdfTableStyle: { margin: [5, 5, 5, 5] },
      exporterPdfTableHeaderStyle: { fontSize: 14, bold: true, italics: true, color: 'red' },
      exporterPdfHeader: { text: 'list SaleOrders', style: 'headerStyle' },
      exporterPdfFooter: function (currentPage, pageCount) {
        return { text: currentPage.toString() + ' of ' + pageCount.toString(), style: 'footerStyle' };
      },
      exporterPdfCustomFormatter: function (docDefinition) {
        docDefinition.styles.headerStyle = { fontSize: 22, bold: true };
        docDefinition.styles.footerStyle = { fontSize: 10, bold: true };
        return docDefinition;
      },
      exporterPdfOrientation: 'portrait',
      exporterPdfPageSize: 'LETTER',
      exporterPdfMaxGridWidth: 500,
      exporterCsvLinkElement: angular.element(document.querySelectorAll('.custom-csv-link-location')),
	  };
    vm.exportToExcel = function(tableId) {
      var exportHref = Excel.tableToExcel(tableId, 'listSaleOrders');
      $timeout(function() {
        location.href = exportHref;
      }, 100);
    };
    vm.exportPdf = function () {
    	if (vm.gridOptions.data.length > 0) vm.gridApi.exporter.pdfExport(uiGridExporterConstants.VISIBLE,uiGridExporterConstants.ALL);
			else vm.gridApi.exporter.pdfExport(uiGridExporterConstants.ALL,uiGridExporterConstants.ALL);
    };
    vm.title = 'SALE REPORT';
    vm.triggerdateclick = function () {
      angular.element('#timeoff_from').triggerHandler('click');
    };
    vm.total_instore = 0;
    vm.total_online = 0;
    vm.total_delivery = 0;
    vm.total_amount = 0;
    vm.total_purchase_order_price = 0;
    vm.display_start_date = moment().format('D MMM YYYY');
    var _date = new Date();
    vm.query_start_date = _date.getDate() + '-' + _date.getMonth() + '-' + _date.getFullYear();    
    vm.change_data = function () {
    	vm.display_start_date = $scope.timeoff_from;
    	var _arr = vm.display_start_date.split(' ');
    	vm.query_start_date = _arr[0] + '-' + _month_by_name(_arr[1]) + '-' + _arr[2];
    	vm.reloadData();
    };
    vm.minusdays = function (_day) {
	  	var _current = new Date(vm.display_start_date);            
      var _month = _current.getMonth() + 1;      
      var _day = _current.getDate() - _day;
      var _year = _current.getFullYear();
      if (_day <=0) {
        _month = _month - 1;
        if(_month == 0){
          _year = _year - 1;
          _month = 12;
        }
        var _max_day = daysInMonth(_month, _year);
        _day = _max_day + _day;
      }
      vm.query_start_date =  _day + '-' + (_month - 1) + '-' +_year;
      _month = _month_by_numner(_month);
      var _yesterday =   _day + ' ' + _month + ' ' +_year;      
      angular.element('#timeoff_from').val(_yesterday);
      angular.element('#timeoff_from').triggerHandler('change');
    	vm.reloadData();  
    };
    vm.plusdays = function (_day) {
    	var _current = new Date(vm.display_start_date);            
			var _month = _current.getMonth() + 1;      
			var _day = _current.getDate() + _day;
			var _year = _current.getFullYear();

			var _max_day = daysInMonth(_month, _year);
			if (_day > _max_day) {
				_month = _month + 1;
				if (_month > 12) {
				  _month = _month - 12;
				  _year = _year + 1;
				}
				_day = _day - _max_day;
			}
			vm.query_start_date =  _day + '-' + (_month - 1) + '-' +_year;
			_month = _month_by_numner(_month);
			var _nextday =   _day + ' ' + _month + ' ' +_year;
			angular.element('#timeoff_from').val(_nextday);
			angular.element('#timeoff_from').triggerHandler('change');
			vm.reloadData();
    };
    vm.reloadData();
  }

}());
function daysInMonth(month,year) {
  return new Date(year, month, 0).getDate();
}
function _month_by_numner (_number) {
	var month = new Array();
	month[1] = "January";
	month[2] = "February";
	month[3] = "March";
	month[4] = "April";
	month[5] = "May";
	month[6] = "June";
	month[7] = "July";
	month[8] = "August";
	month[9] = "September";
	month[10] = "October";
	month[11] = "November";
	month[12] = "December";
	return month[_number];
}
function _month_by_name (_number) {
	var month = new Array();
	month['January'] = 0;
	month['February'] = 1;
	month['March'] = 2;
	month['April'] = 3;
	month['May'] = 4;
	month['June'] = 5;
	month['July'] = 6;
	month['August'] = 7;
	month['September'] = 8;
	month['October'] = 9;
	month['November'] = 10;
	month['December'] = 11;
	return month[_number];
}
Number.prototype.formatMoney = function(c, d, t){
	var n = this, 
	c = isNaN(c = Math.abs(c)) ? 2 : c, 
	d = d == undefined ? "." : d, 
	t = t == undefined ? "," : t, 
	s = n < 0 ? "-" : "", 
	i = String(parseInt(n = Math.abs(Number(n) || 0).toFixed(c))), 
	j = (j = i.length) > 3 ? j % 3 : 0;
	return s + (j ? i.substr(0, j) + t : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + t) + (c ? d + Math.abs(n - i).toFixed(c).slice(2) : "");
};
