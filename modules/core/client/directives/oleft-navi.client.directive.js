(function () {
  'use strict';

  angular.module('core')
    .directive('oleftNavi', oleftNavi);

  oleftNavi.$inject = ['$rootScope', '$interpolate', '$state', '$window'];

  function oleftNavi($rootScope, $interpolate, $state, $window) {
    return {
      restrict: 'A',
      link: function (scope, element){
        element.bind('click', function(e) {
            var left = angular.element('#left_cont');
            var right = angular.element('#right_cont');
            var w = angular.element($window); 
            var right_w = w.width() - 235;
            if(right.attr("rel") == 1) {
              //Open menu
              left.removeClass("left_navoff").addClass("left_navon");
              right.removeClass("right_navon").addClass("right_navoff");
              right.css("width", right_w+"px");
              right.attr("rel", 0);
            }else{
              //Close Menu
              left.removeClass("left_navon").addClass("left_navoff");
              right.removeClass("right_navoff").addClass("right_navon");
              right.css("width", "100%");
              right.attr("rel", 1);
            }
        });
      }
    };

  }
}());
