define(function (require) {
  // get the kibana/metric_vis module, and make sure that it requires the "kibana" module if it
  // didn't already
  var module = require('ui/modules').get('kibana/kibi_horizontal_bar_vis', ['kibana']);
  var d3 = require('d3');

  module.controller('KbnHorizontalBarVisController', function ($scope, $element, $rootScope, Private) {
    var tabifyAggResponse = Private(require('ui/agg_response/tabify/tabify'));

    var data, config, chart_vis;
    var margin, width, height;

    //mouse events
    var over = "ontouchstart" in window ? "touchstart" : "mouseover";
    var out = "ontouchstart" in window ? "touchend" : "mouseout";

    // declare data
    var tableGroups = null;

    var svg_root = $element[0] ; 
    // d3.select($element[0]).selectAll("svg").remove();

    var _updateDimensions = function () {
      var delta = 18;
      var w = $element.parent().width();
      var h = $element.parent().height();
      if (w) {
        if (w > delta) {
          w -= delta;
        }
        width = w;
      }
      if (h) {
        if (h > delta) {
          h -= delta;
        }
        height = h;
      }
    };

    var off = $rootScope.$on('change:vis', function () {
      _updateDimensions();
      _initConfig();
      $scope.processTableGroups(tableGroups);
      // _updateConfig();
      _render();
    });
    $scope.$on('$destroy', off);

    $scope.processTableGroups = function (tableGroups) {
      tableGroups.tables.forEach(function (table) {
        data = [];
        var cols = table.columns;
        table.rows.forEach(function(row,i){
            var group = {};
            group['group'] = row[0];
            var axes = [];
            for (var i = 1; i < row.length; i++) {
                var item = {};
                item.axis = cols[i].aggConfig.params.field.displayName;
                item.value = row[i];
                axes.push(item);              
            }
            group.axes = axes;
            data.push(group);
        });
      });
    };

  // set default config  
    var _initConfig = function(){
      margin = 20;
      // var chart_w = 450;
      // var chart_h = 450;
      var chart_w = width/3;
      var chart_h = width/3;
      
    };

   
    var _render = function(){
       d3.select(svg_root).selectAll("svg").remove();     
       
    };

    var _buildVis = function(data) {
       
    };

   

    $scope.$watch('esResponse', function (resp) {
      if (resp) {
        // $scope.processTableGroups(tabifyAggResponse($scope.vis, resp));
        // var tableGroups = tabifyAggResponse($scope.vis, resp);
        tableGroups = tabifyAggResponse($scope.vis, resp);
        if(tableGroups.tables.length>0){
          if(tableGroups.tables[0].columns.length > 2){
            _updateDimensions();
            _initConfig();
            $scope.processTableGroups(tableGroups);
            _render();
          }
        }        
      }
    });
  });
});
