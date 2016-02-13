var data_url = 'https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/global-temperature.json';

d3.json(data_url, function(err, jsonData) {
  if (err) throw err;
  /***** Set up *****/
  var margin = {
    top: 30,
    right: 0,
    bottom: 30,
    left: 50
  };

  var width = 1100 - margin.left - margin.right;
  var height = 700 - margin.top - margin.bottom;

  var minYear = d3.min(jsonData.monthlyVariance, function(d) { return d.year; });
  var maxYear = d3.max(jsonData.monthlyVariance, function(d) { return d.year; });
  console.log(minYear, maxYear);

  /***** Create SVG *****/
  var svg = d3.select('body')
    .append('svg')
    .attr({
      width: width + margin.right + margin.left,
      height: height + margin.top + margin.bottom
    });

  /***** X-Axis *****/
  var xScale = d3.scale.linear()
    .domain([minYear, maxYear])
    .range([0, width]);

  var xAxisCreate = d3.svg.axis()
    .scale(xScale)
    .ticks(24)
    .orient('bottom');

  var xAxis = svg.append('g')
    .call(xAxisCreate)
    .attr({
      'class': 'axis',
      'transform': 'translate('+margin.left+','+height+')'
    });

  /***** Y-Axis *****/
});