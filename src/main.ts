import * as d3 from "d3";

// Data values for each bar
const data = [10, 30, 50, 100];

// Configuration for chart dimensions and styling
const CHART_CONFIG = {
  width: 500,
  height: 200,
  barColor: "steelblue",        // Default bar color
  hoverColor: "orange",         // Color on hover
  barPadding: 0.1,              // Padding between bars (10%)
  transitionDuration: 800,      // Animation duration in milliseconds
  hoverTransform: "translateY(-5px)", // Transform on hover
  hoverTransitionSpeed: 200,    // Hover transform transition in milliseconds
  yAxisMax: 100,                // Maximum value for y-axis scale
};

// Select the #app container and append an SVG element
const app = d3.select("#app");
const svg = app
  .append("svg")
  .style("width", CHART_CONFIG.width)
  .style("height", CHART_CONFIG.height);

// X-axis scale: maps data indices (0, 1, 2, 3) to pixel positions
// scaleBand divides the width into equal bands with padding between them
const x = d3
  .scaleBand<number>()
  .domain(d3.range(data.length))  // Domain: [0, 1, 2, 3]
  .range([0, CHART_CONFIG.width]) // Range: 0 to 500 pixels
  .padding(CHART_CONFIG.barPadding);  // Add padding between bars

// Y-axis scale: maps data values (0-100) to pixel positions
// scaleLinear maps numbers directly; range is inverted (200 to 0) because SVG Y increases downward
const y = d3.scaleLinear()
  .domain([0, CHART_CONFIG.yAxisMax])  // Data range
  .range([CHART_CONFIG.height, 0]);    // Inverted: 200px (bottom) to 0px (top)
// Bind data to rectangles and create the bar chart
svg
  .selectAll("rect")           // Select all rect elements (initially empty)
  .data(data)                  // Bind data array to selection
  .join("rect")                // Create one rect per data point
  // Set initial position and size (before transition)
  .attr("x", (_, i) => x(i) || 0)  // Position bars horizontally using x-scale
  .attr("y", CHART_CONFIG.height)  // Start at bottom
  .attr("width", x.bandwidth())    // Bar width from scale
  .attr("height", 0)               // Start with 0 height
  .attr("fill", CHART_CONFIG.barColor)  // Bar color
  .style("cursor", "pointer")      // Show pointer on hover
  .style("transition", `transform ${CHART_CONFIG.hoverTransitionSpeed}ms ease-out`) // Smooth transform animation
  // Hover effect: change color and move up
  .on("mouseover", function () {
    d3.select(this)
      .attr("fill", CHART_CONFIG.hoverColor)
      .style("transform", CHART_CONFIG.hoverTransform);
  })
  // Reset on mouse out
  .on("mouseout", function () {
    d3.select(this)
      .attr("fill", CHART_CONFIG.barColor)
      .style("transform", null);
  })
  // Animate bars growing from bottom to final height
  .transition()
  .duration(CHART_CONFIG.transitionDuration)
  .attr("y", (d) => y(d))     // Animate to final Y position (top of bar)
  .attr("height", (d) => CHART_CONFIG.height - y(d)); // Animate to final height
