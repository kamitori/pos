(function () {
  'use strict';

  var app = angular
    .module('salesreports')
    .controller('SalesreportsListWeeklyController', SalesreportsListWeeklyController)
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

  SalesreportsListWeeklyController.$inject = ['SalesreportsService', '$scope', '$rootScope', 'uiGridConstants', '$http', 'Notification', 'Excel', '$timeout', 'uiGridExporterConstants'];

  function SalesreportsListWeeklyController(SalesreportsService, $scope, $rootScope, uiGridConstants, $http, Notification, Excel, $timeout, uiGridExporterConstants) {
    var vm = this;
    vm.current_week = function () {
      var _date = new Date(vm.display_start_date).getDate();
      _date = Math.ceil(_date / 7);
      return _date > 4 ? 4 : _date;
    };
		vm.convertToDayOfWeek = function (_date) {
      var _day = parseInt(_date, 10);
      if (_day >= 7) _day = _day % 7;
      return _day;
    };    
    vm.getStartDay = function (_current_date, _current_date_time) {
    	var _month = _current_date.getMonth() + 1;
    	if (_current_date_time <=0) {
    		_month -= 1;
    		var _max_day = daysInMonth(_month, _current_date.getFullYear());
    		_current_date_time += _max_day;
    	}
    	return ( _month_by_numner(_month) + ' ' + _current_date_time );
    };
    vm.getEndDay = function (_current_date, _current_date_time) {    	
    	var _month = _current_date.getMonth() + 1;    	
    	_current_date_time += 6;    	
    	return ( _month_by_numner(_month) + ' ' + _current_date_time );
    };

    vm.salesreports = [];
    vm.current_month = _month_by_numner(new Date().getMonth() + 1);
    vm.current_year = new Date().getFullYear();
    vm.display_start_date = '';
    vm.display_end_date = '';
    var _current_date = new Date();
    var _current_date_time = _current_date.getDate();
    _current_date_time = _current_date_time - vm.convertToDayOfWeek(_current_date_time) + 1;
    vm.display_start_date = vm.getStartDay(_current_date, _current_date_time);
    vm.display_end_date = vm.getEndDay(_current_date, _current_date_time);
    vm.current_weeks = vm.current_week();
    vm.reloadData = function () {
    	var _year = vm.current_year;    	
    	var display_start_date = vm.display_start_date;
    	var _arr = display_start_date.split(' ');
    	var _start = _arr[1] + '-' + _month_by_name() + '-' + vm.current_year;
    	vm.current_month = _arr[0];
    	var display_end_date = vm.display_end_date;
    	_arr = display_end_date.split(' ');
    	var _end = _arr[1] + '-' + _month_by_name(_arr[0]) + '-' + vm.current_year;    	
    	$http({
	      method: 'POST',
	      url: '/api/salesreports/getdatadates',
	      data: {
	        'start': _start,
	        'end': _end
	      },
	      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
	    }).success(function(data, status, headers, config) {
	    	vm.current_weeks = vm.current_week();
  	    vm.total_instore = 0;
		    vm.total_online = 0;
		    vm.total_delivery = 0;
		    vm.total_amount = 0;
		    vm.total_purchase_order_price = 0;
		    var _all_data = [];
	    	if (data.length) {	    		
		    	for (var day = 1; day <=7; day++) {
		    		var one = [];
		    		var _total_instore = 0;
		    		var _total_online = 0;
		    		var _total_delivery = 0;
		    		var _total_po = 0;
		    		var _arr = vm.display_start_date.split(' ');
		    		var new_day = day;
		    		if (new_day == 7) new_day = 0;
		    		var _day = '';
		    		if (new_day == 1) _day = parseInt(_arr[1], 10);
		    		else if(new_day == 0) _day = parseInt(_arr[1], 10) + 6;
		    		else _day = parseInt(_arr[1], 10) + new_day - 1;

		    		for(var item in data) {
		    			var one_current_date = new Date(data[item].salesorder_date);
		    			var dayofweek = vm.convertToDayOfWeek(one_current_date.getDate());	    			
		    			if (dayofweek != day) continue;
			    		if (data[item].heading === 'Create from POS') {
			    			vm.total_instore += parseFloat(data[item].sum_amount);
			    			_total_instore += parseFloat(data[item].sum_amount);
			    		} else if (data[item].heading === 'online') {
			    			vm.total_online += parseFloat(data[item].sum_amount);
			    			_total_online += parseFloat(data[item].sum_amount);
			    		} else if (data[item].heading === 'delievry') {
			    			vm.total_delivery += parseFloat(data[item].sum_amount);
			    			_total_delivery += parseFloat(data[item].sum_amount);
			    		}
			    		one.push(data);
			    	}
			    	var _datas = {
			    		'datas': one,
			    		'day': get_name_day_week(new_day),
			    		'date': (_day + ' ' + _arr[0] + ' ' + vm.current_year),
			    		'total_instore': _total_instore,
			    		'total_online': _total_online,
			    		'total_delivery': _total_delivery,
			    		'total_po': _total_po,
			    		'total': (_total_instore + _total_online + _total_delivery + _total_po)
			    	};
			    	_all_data.push(_datas)
		    	}
		    	vm.total_amount = (vm.total_instore + vm.total_online + vm.total_delivery).formatMoney(2);
		    	vm.total_instore = (vm.total_instore).formatMoney(2);
		    	vm.total_online = (vm.total_online).formatMoney(2);
		    	vm.total_delivery = (vm.total_delivery).formatMoney(2);
		    	vm.gridOptions.data = _all_data;
		    	vm.gridApi.core.refresh();
	    	} else {
	    		vm.gridOptions.data = [];
		    	vm.gridApi.core.refresh();
	    	}
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
	      	field: 'day',
	      	'name': 'Day',
	      	cellTemplate: "<p><i class='fa fa-play' aria-hidden='true' style='cursor: pointer'></i>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{{row.entity.day}}</p>",
	      },
	      { 
	      	field: 'date',
	      	name: 'Date'
	      },
	      {
	      	field: 'total_instore',
	      	name: 'In-Store',
	      	cellTemplate: '<span>${{(row.entity.total_instore).formatMoney(2)}}</span>',
	      	cellFilter: 'formatNumber:2',
	      },
	      {
	      	field: 'total_online',
	      	name: 'Online',
	      	cellTemplate: '<span>${{(row.entity.total_online).formatMoney(2)}}</span>',
	      	cellFilter: 'formatNumber:2',
	      },
	      {
	      	field: 'total_delivery',
	      	name: 'Delivery',
	      	cellTemplate: '<span>${{(row.entity.total_delivery).formatMoney(2)}}</span>',
	      	cellFilter: 'formatNumber:2',
	      },
	      { 
	      	field: 'total_po',
	      	name: 'PO',
	      	cellTemplate: '<span>${{(row.entity.total_po).formatMoney(2)}}</span>',
	      	cellFilter: 'formatNumber:2',
	      },
	      { 
	      	field: 'total',
	      	name: 'Total',
	      	cellTemplate: '<span>${{(row.entity.total).formatMoney(2)}}</span>',
	      	cellFilter: 'formatNumber:2',
	      }
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

    var _date = new Date();
    vm.query_start_date = _date.getDate() + '-' + _date.getMonth() + '-' + _date.getFullYear();    
    vm.change_data = function () {
    	var _data = $scope.timeoff_from;
    	var _arr = _data.split(' ');
    	var _current_date = new Date(_data);
    	var _current_date_time = _arr[0];
    	_current_date_time = _current_date_time - vm.convertToDayOfWeek(_current_date_time) + 1;

    	vm.display_start_date = vm.getStartDay(_current_date, _current_date_time);
    	vm.display_end_date = vm.getEndDay(_current_date, _current_date_time);    	
    	// vm.current_year = _arr[2];
    	vm.reloadData();
    };
    vm.minusdays = function (_day) {
	  	var _current = new Date(vm.display_start_date);
      var _month = _current.getMonth() + 1;      
      var _day = _current.getDate() - _day;
      var _current_day = _day + 6;
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
      vm.display_start_date =  _month_by_numner(_month) + ' ' +_day;
      vm.display_end_date = _month_by_numner(_month) + ' ' + _current_day;
      _month = _month_by_numner(_month);
      var _yesterday =   _day + ' ' + _month + ' ' + _year;
      // vm.current_year = _year;
      // console.log(vm.current_year + ' minusday');
      angular.element('#timeoff_from').val(_yesterday);
      angular.element('#timeoff_from').triggerHandler('change');
			// vm.reloadData();
    };
    vm.plusdays = function (_day) {
    	var _current = new Date(vm.display_start_date);
			var _month = _current.getMonth() + 1;
			var _number_of_day = _day;
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
			var _current_day = _number_of_day + _day - 1;
			var next_month = _month;
			if (_current_day > _max_day) {
				next_month = _month + 1;
				_current_day = _current_day - _max_day;
			}
			vm.query_start_date =  _day + '-' + (_month - 1) + '-' + _year;

			vm.display_start_date =  _month_by_numner(_month) + ' ' + _day;
      vm.display_end_date = _month_by_numner(next_month) + ' ' + _current_day;

			_month = _month_by_numner(_month);
			var _nextday =   _day + ' ' + _month + ' ' + _year;
			// vm.current_year = _year;
			// console.log(vm.current_year + ' plus');
			angular.element('#timeoff_from').val(_nextday);
			angular.element('#timeoff_from').triggerHandler('change');
			// vm.reloadData();
    };
    vm.reloadData();
  }

}());
function daysInMonth(month,year) {
  return new Date(year, month, 0).getDate();
}
function get_name_day_week(_dayIndex) {
  return ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][_dayIndex];
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
	d = d == undefined ? '.' : d, 
	t = t == undefined ? ', ' : t, 
	s = n < 0 ? '-' : '', 
	i = String(parseInt(n = Math.abs(Number(n) || 0).toFixed(c))), 
	j = (j = i.length) > 3 ? j % 3 : 0;
	return s + (j ? i.substr(0, j) + t : '') + i.substr(j).replace(/(\d{3})(?=\d)/g, '$1' + t) + (c ? d + Math.abs(n - i).toFixed(c).slice(2) : '');
};
function daysInMonth(month, year) {
  return new Date(year, month, 0).getDate();
}
