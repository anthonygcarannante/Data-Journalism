// The code for the chart is wrapped inside a function that
// automatically resizes the chart
function makeResponsive() {

  // if the SVG area isn't empty when the browser loads,
  // remove it and replace it with a resized version of the chart
  var svgArea = d3.select("body").select("svg");
  
  // clear svg is not empty
  if (!svgArea.empty()) {
    svgArea.remove();
  };

  // SVG wrapper dimensions are determined by the current width and
  // height of the browser window.
  svgWidth = window.innerWidth;
  svgHeight = window.innerHeight; 

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
      d.obesity = +d.obesity;
      d.smokes = +d.smokes;
    });

    // Independent x-coordinates
    var xScale = d3.scaleLinear()
      .domain([d3.min(censusData, d => d.healthcare) * 0.8, d3.max(censusData, d => d.healthcare) * 1.1])
      .range([0, chartWidth]);

    // Dependent y-coordinates
    var yScale = d3.scaleLinear()
      .domain([d3.min(censusData, d => d.poverty) * 0.8, d3.max(censusData, d => d.poverty) * 1.1])
      .range([chartHeight, 0]);

    // Create axis
    var xAxis = d3.axisBottom(xScale);
    var yAxis = d3.axisLeft(yScale);

    chartGroup.append("g")
      .attr("transform", `translate(0, ${chartHeight})`)
      .call(xAxis);

    chartGroup.append("g")
      .call(yAxis);

    // Format Axis Labels
    chartGroup.append("text")
      .attr("text-anchor", "end")
      .attr("x", (chartWidth / 2))
      .attr("y", chartHeight + 40)
      .text("Healthcare");

    chartGroup.append("text")
      .attr("text-anchor", "end")
      .attr("transform", "rotate(-90)")
      .attr("x", 0 - (chartHeight / 2))
      .attr("y", 0 - margin.left + 20)
      .text("Poverty");

    // Format scatter plot points
    var circleGroup = chartGroup.selectAll("circle")
      .data(censusData);

    var elemEnter = circleGroup.enter();

    // Create circles for data points
    var circle = elemEnter.append("circle")
      .attr("cx", d => xScale(d.healthcare))
      .attr("cy", d => yScale(d.poverty))
      .attr("r", "15")
      .classed("stateCircle", true);

    // Create text for state abbreviations inside circles
    var circleText = elemEnter.append("text")
      .attr("x", d => xScale(d.healthcare))
      .attr("y", d => yScale(d.poverty)+5)
      .text(d => d.abbr)
      .classed("stateText", true);

    // Create Tooltip: Apppend tooltip div
    var toolTip = d3.tip()
      .attr("class", "d3-tip")
      .html(function(d) {
        return `<strong>Healthcare: ${d.healthcare}%</strong><hr>Poverty: ${d.poverty}%`
      })
    
    circle.call(toolTip);

    circle.on("mouseover", function(d) {
      toolTip.show(d);
    })
    .on("mouseout", function(d) {
      toolTip.hide(d);
    })
    circleText.on("mouseover", function(d) {
      toolTip.show(d);
    })
    .on("mouseout", function(d) {
      toolTip.hide(d);
    })

  });
};

// When the browser loads, makeResponsive() is called.
makeResponsive();

// When the browser window is resized, makeResponsive() is called.
d3.select(window).on("resize", makeResponsive);

