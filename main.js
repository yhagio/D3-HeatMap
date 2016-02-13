var data_url = 'https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/global-temperature.json';

d3.json(data_url, function(err, jsonData) {
  if (err) throw err;

  /***************
    Set up
  ***************/
  var margin = {
    top: 30,
    right: 0,
    bottom: 50,
    left: 80
  };

  var width = 1100 - margin.left - margin.right;
  var height = 700 - margin.top - margin.bottom;

  var minYear = d3.min(jsonData.monthlyVariance, function(d) { return d.year; });
  var maxYear = d3.max(jsonData.monthlyVariance, function(d) { return d.year; });

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
    .domain([minYear, maxYear])
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

  xAxis.append('text')
    .attr({
      "transform": "translate("+(width-margin.left)/2+","+ margin.bottom +")",
      "class": "labelText"
    })
    .text('Year');

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

  yAxis.append('text')
    .attr({
      "transform": "translate("+(-60)+","+(height-margin.top)/2+")rotate(-90)",
      "class": "labelText"
    })
    .text("Months");


});