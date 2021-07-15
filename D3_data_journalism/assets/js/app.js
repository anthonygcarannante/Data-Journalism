// Define the SVG area margins
var svgWidth = 960;
var svgHeight = 600;

// Define the chart's margins as an object
var margin = {
    top: 50,
    right: 50,
    bottom: 50,
    left: 50
};

// Define dimensions of the chart area
var chartWidth = svgWidth - margin.left - margin.right;
var chartHeight = svgHeight - margin.top - margin.bottom;

  // Select body, append SVG area to it, and set its dimensions
  var svg = d3.select("#scatter")
    .append("svg")
    .attr("width", svgWidth)
    .attr("height", svgHeight);

  // Append a group area, then set its margins
  var chartGroup = svg.append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Healthcare vs. Poverty Scatter Plot

// Load data from csv file
d3.csv("assets/data/data.csv").then(function(censusData){

  // Format data to numbers for appropriate scaling
  // https://www.w3schools.com/js/js_number_methods.asp
  censusData.forEach(function(d) {
    d.healthcare = +d.healthcare;
    d.poverty = +d.poverty;
    d.age = +d.age;
    d.income = +d.income;
  });

  console.log(censusData);

  // Independent x-coordinates
  var xScale = d3.scaleLinear()
    .domain([d3.min(censusData, d => d.income) - 2, d3.max(censusData, d => d.income)])
    .range([0, svgWidth]);

  // Dependent y-coordinates
  var yScale = d3.scaleLinear()
    .domain([0, d3.max(censusData, d => d.poverty)])
    .range([svgHeight, 0]);

  // Create axis
  var xAxis = d3.axisBottom(xScale);
  var yAxis = d3.axisLeft(yScale);

  chartGroup.append("g")
    .attr("transform", `translate(0, ${chartHeight})`)
    .call(xAxis);

  chartGroup.append("g")
    .call(yAxis);

  // Format scatter plot points
  var circleGroup = chartGroup.selectAll("circle")
    .data(censusData)
  
  var elemEnter = circleGroup.enter();

  // Create circles for data points
  var circle = elemEnter.append("circle")
    .attr("cx", d => xScale(d.income))
    .attr("cy", d => yScale(d.poverty))
    .attr("r", "15")
    .attr("fill", "orange")
    .attr("stroke-width", "1")
    .attr("stroke", "black")
    .classed("state-circle");

  // Create text for state abbreviations inside circles
  var circleText = elemEnter.append("text")
    .attr("x", d => xScale(d.income)-10)
    .attr("y", d => yScale(d.poverty)+5)
    .text(d => d.abbr)
    .classed("state-text");

  // Format Axis Labels
    chartGroup.append("text")
    .attr("text-anchor", "end")
    .attr("x", chartWidth)
    .attr("y", chartHeight + 40)
    .text("Healthcare");

  chartGroup.append("text")
    .attr("text-anchor", "end")
    .attr("transform", "rotate(-90)")
    .attr("x", - margin.top)
    .attr("y", - margin.left + 20)
    .text("Poverty");
});


