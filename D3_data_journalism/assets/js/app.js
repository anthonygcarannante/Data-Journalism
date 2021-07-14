// Define the SVG area margins
var svgWidth = 960;
var svgHeight = 500;

// Define the chart's margins as an object
var margin = {
    top: 60,
    right: 60,
    bottom: 60,
    left: 60
};

// Define dimensions of the chart area
var chartWidth = svgWidth - margin.left - margin.right;
var chartHeight = svgHeight - margin.top - margin.bottom;

// Healthcare vs. Poverty Scatter Plot

// Load data from csv file
d3.csv("assets/data/data.csv").then(function(censusData){

  console.log(typeof censusData.healthcare);
  console.log(typeof censusData.poverty);

  censusData.forEach(function(d) {
    d.healthcare = +d.healthcare;
    d.poverty = +d.poverty;
  });

  console.log(typeof(censusData.healthcare));
  console.log(typeof(censusData.healthcare));

  console.log(censusData);
  // Independent x-coordinates
  var xScale = d3.scaleLinear()
                  .domain([0, d3.max(censusData, d => d.healthcare)])
                  .range([0, svgWidth]);

  // Dependent y-coordinates
  var yScale = d3.scaleLinear()
                  .domain([0, d3.max(censusData, d => d.poverty)])
                  .range([svgHeight, 0]);

  console.log(`${xScale(13.9)}`)
  // Create axis
  var xAxis = d3.axisBottom(xScale);
  var yAxis = d3.axisLeft(yScale);

  // Select body, append SVG area to it, and set its dimensions
  var svg = d3.select("#scatter")
              .append("svg")
              .attr("width", svgWidth)
              .attr("height", svgHeight);

  // Append a group area, then set its margins
  var chartGroup = svg.append("g")
                      .attr("transform", `translate(${margin.left}, ${margin.top})`);

  chartGroup.append("g")
            .attr("transform", `translate(0, ${chartHeight})`)
            .classed("axis", true)
            .call(xAxis);

  chartGroup.append("g")
            .classed("axis", true)
            .call(yAxis);

  chartGroup.append("g").selectAll("circle")
            .data(censusData)
            .enter()
            .append("circle")
            .attr("cx", function(d) {return xScale(d.healthcare);})
            .attr("cy", function(d) {return yScale(d.poverty);})
            .attr("r", "1.5");

});

