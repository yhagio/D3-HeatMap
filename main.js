var data_url = 'https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/global-temperature.json';

d3.json(data_url, function(err, jsonData) {
  if (err) throw err;

  /***************
    Set up
  ***************/
  var margin = {
    top: 30,
    right: 0,
    bottom: 80,
    left: 80
  };
  
  var width = 1100 - margin.left - margin.right;
  var height = 600 - margin.top - margin.bottom;
  
  // Get min max year
  var minYear = d3.min(jsonData.monthlyVariance, function(d) { return d.year; });
  var maxYear = d3.max(jsonData.monthlyVariance, function(d) { return d.year; });
  
  // Set up each heat map cell size
  var cellHeight = height / 12;
  var cellWidth = width / ((maxYear - minYear));
  
  // Get min max variance (temperature)
  var minVar = d3.min(jsonData.monthlyVariance, function(d) { return d.variance; });
  var maxVar = d3.max(jsonData.monthlyVariance, function(d) { return d.variance; });

  var baseTemp = parseFloat(jsonData.baseTemperature);
  
  /*************** 
    Create SVG 
  ***************/
  var svg = d3.select('body')
    .append('svg')
    .attr({
      width: width + margin.right + margin.left,
      height: height + margin.top + margin.bottom
    });

  /*************** 
    X-Axis 
  ***************/
  var xScale = d3.scale.linear()
    .domain([minYear, maxYear+1])
    .range([0, width]);

  var xAxisCreate = d3.svg.axis()
    .scale(xScale)
    .ticks(24)
    .orient('bottom')
    .tickFormat(function(d) { return d;});

  var xAxis = svg.append('g')
    .call(xAxisCreate)
    .attr({
      'class': 'axis',
      'transform': 'translate('+margin.left+','+height+')'
    });
  
  // X-Axis Label
  xAxis.append('text')
    .attr({
      "transform": "translate("+(width-margin.left)/2+","+ (margin.bottom / 2) +")",
      "class": "labelText"
    })
    .text('Years');

  /***************
    Y-Axis
  ***************/
  var yScale = d3.time.scale()
    .domain([new Date(2012, 0, 1), new Date(2012, 11, 31)])
    .range([0, height]);

  var yAxisCreate = d3.svg.axis()
    .scale(yScale)
    .orient('left')
    .ticks(d3.time.months)
    .tickFormat(d3.time.format('%B'));

  var yAxis = svg.append('g')
    .call(yAxisCreate)
    .attr({
      'class': 'axis y',
      'transform': 'translate('+margin.left+', '+margin.top+')'
    });
  
  // Y-Axis Label
  yAxis.append('text')
    .attr({
      "transform": "translate("+(-60)+","+(height-margin.top)/2+")rotate(-90)",
      "class": "labelText"
    })
    .text("Months");

  /***************
    Color range of heat map
  ***************/
  var color = d3.scale.linear()
    .domain([minVar, maxVar])
    .range(['rgb(94, 79, 162)', 'rgb(158, 1, 66)']);

  /***************
    Add heat map grids
  ***************/
  svg.selectAll('rect')
    .data(jsonData.monthlyVariance)
    .enter()
    .append('rect')
    .attr({
      x: function(d) {
        return xScale(d.year);
      },
      y: function(d) {
        return yScale(new Date(2012, d.month-1, 1));
      },
      width: cellWidth,
      height: cellHeight,
      fill: function(d) {
        return assignColor(d, baseTemp)
      },
      transform: 'translate('+margin.left+',0)'
    })
    /****  ADD Tooltip ****/
    .on('mouseover', function(d) {
      console.log( d3.mouse(this) );

      d3.select('#tooltip')
        .transition()
        .ease('quad')
        .duration(100)
        .style("opacity", 1);

      d3.select('#tooltip')
        .style("left", d3.mouse(this)[0] + 50 + "px")
        .style("top", d3.mouse(this)[1] + 30 + "px")
        .select("#value")
          .html(
            '<strong class="yearMonth">'+d.year+' - '+ months[d.month-1]+'</strong>'+
            '<p>' + (parseFloat(8.66)+parseFloat(d.variance)).toFixed(2) + ' ℃</p>'+
            '<p>'+parseFloat(d.variance)+' ℃</p>');
    })
    .on('mouseout', function() {
      d3.select('#tooltip')
        .transition()
        .ease('quad')
        .duration(100)
        .style("opacity", 0);
    });

    var months = [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December'
    ];

  /***************
    Add heat map temperature indicator at bottom-right
  ***************/

  var colors = [
    'rgb(94, 79, 162)',
    'rgb(50, 136, 189)',
    'rgb(102, 194, 165)',
    'rgb(171, 221, 164)',
    'rgb(230, 245, 152)',
    'rgb(255, 255, 191)',
    'rgb(254, 224, 139)',
    'rgb(253, 174, 97)',
    'rgb(244, 109, 67)',
    'rgb(213, 62, 79)',
    'rgb(158, 1, 66)'
  ];

  var colorsLabelTexts = [
    0.0,
    2.7,
    3.9,
    5.0,
    6.1,
    7.2,
    8.3,
    9.4,
    10.5,
    11.6,
    12.7
  ];

  for (var i = 0; colors.length > i; i++) {
    svg.append('rect')
      .attr({
        x: function() {
          return (width / 2) + margin.left * 2 + (i*35);
        },
        y: function() {
          return height + margin.top + 10;
        },
        width: 35,
        height: 20,
        fill: function() {
          return colors[i];
        }
      });

    svg.append('text')
      .attr({
        x: function() {
          return (width / 2) + margin.left * 2 + (i*35) + 5;
        },
        y: function() {
          return height + margin.top + 42;
        },
        class: 'colorsLabelText'
      })
      .text(function() {
        return colorsLabelTexts[i];
      })
  }


}); 

// HELPER : Assign color depending on the temperature
function assignColor(d, baseTemp) {
  var temp = baseTemp + parseFloat(d.variance);

  if (temp <= 2.7) {
    return 'rgb(94, 79, 162)';
  } 

  if ((2.7 < temp) && (temp <= 3.9)) {
    return 'rgb(50, 136, 189)';
  }

  if ((3.9 < temp) && (temp <= 5)) {
    return 'rgb(102, 194, 165)';
  }

  if ((5 < temp) && (temp <= 6.1)) {
    return 'rgb(171, 221, 164)';
  }

  if ((6.1 < temp) && (temp <= 7.2)) {
    return 'rgb(230, 245, 152)';
  }

  if ((7.2 < temp) && (temp <= 8.3)) {
    return 'rgb(255, 255, 191)';
  }

  if ((8.3 < temp) && (temp <= 9.4)) {
    return 'rgb(254, 224, 139)';
  }

  if ((9.4 < temp) && (temp <= 10.5)) {
    return 'rgb(253, 174, 97)';
  }

  if ((10.5 < temp) && (temp <= 11.6)) {
    return 'rgb(244, 109, 67)';
  }

  if ((11.6 < temp) && (temp <= 12.7)) {
    return 'rgb(213, 62, 79)';
  }

  if (12.7 < temp) {
    return 'rgb(158, 1, 66)';
  }
}