
// async function drawParallelCoordinates() {
//     const data = await d3.csv("cars.csv");
//     //data = FileAttachment("cars.csv").csv({typed: true})
//     const keys = data.columns.slice(1);
//     const keyz = keys[0]; // Assuming that keyz is the first key in the array
//     // import {legend as Legend} from "@d3/color-legend"
//     // Specify the chart’s dimensions.
    
//     const width = 928;
//     const height = keys.length * 120;
//     const marginTop = 20;
//     const marginRight = 10;
//     const marginBottom = 20;
//     const marginLeft = 10;
  
//     // Create an horizontal (*x*) scale for each key.
//     const x = new Map(Array.from(keys, key => [key, d3.scaleLinear(d3.extent(data, d => d[key]), [marginLeft, width - marginRight])]));
  
//     // Create the vertical (*y*) scale.
//     const y = d3.scalePoint(keys, [marginTop, height - marginBottom]);
  
//     // Create the color scale.
//     const color = d3.scaleSequential(x.get(keyz).domain(), t => d3.interpolateBrBG(1 - t));
  
//     // Create the SVG container.
//     const svg = d3.select("#parallel")
//     .attr("viewBox", [0, 0, width, height])
//     .attr("width", width)
//     .attr("height", height)
//     .attr("style", "max-width: 100%; height: auto;");
  
//     // Append the lines.
//     const line = d3.line()
//       .defined(([, value]) => value != null)
//       .x(([key, value]) => x.get(key)(value))
//       .y(([key]) => y(key));
  
//     svg.append("g")
//         .attr("fill", "none")
//         .attr("stroke-width", 1.5)
//         .attr("stroke-opacity", 0.4)
//       .selectAll("path")
//       .data(data.slice().sort((a, b) => d3.ascending(a[keyz], b[keyz])))
//       .join("path")
//         .attr("stroke", d => color(d[keyz]))
//         .attr("d", d => line(d3.cross(keys, [d], (key, d) => [key, d[key]])))
//       .append("title")
//         .text(d => d.name);
  
//     // Append the axis for each key.
//     svg.append("g")
//       .selectAll("g")
//       .data(keys)
//       .join("g")
//         .attr("transform", d => `translate(0,${y(d)})`)
//         .each(function(d) { d3.select(this).call(d3.axisBottom(x.get(d))); })
//         .call(g => g.append("text")
//           .attr("x", marginLeft)
//           .attr("y", -6)
//           .attr("text-anchor", "start")
//           .attr("fill", "currentColor")
//           .text(d => d))
//         .call(g => g.selectAll("text")
//           .clone(true).lower()
//           .attr("fill", "none")
//           .attr("stroke-width", 5)
//           .attr("stroke-linejoin", "round")
//           .attr("stroke", "white"));
  
//     return Object.assign(svg.node(), {scales: {color}});
//   }

// drawParallelCoordinates();

// JavaScript File: parallel.js

// Define the data for the parallel coordinates
// JavaScript File: parallel.js

// Define the data for the parallel coordinates
var data = [
  { "Category": "A", "Value1": 10, "Value2": 20, "Value3": 30 },
  { "Category": "B", "Value1": 15, "Value2": 25, "Value3": 35 },
  { "Category": "C", "Value1": 20, "Value2": 30, "Value3": 40 },
  { "Category": "D", "Value1": 25, "Value2": 35, "Value3": 45 },
  { "Category": "E", "Value1": 30, "Value2": 40, "Value3": 50 }
];

// Set up the dimensions of the SVG container
var width = 700;
var height = 300;

// Create the SVG container
var svg = d3.select("#parallel")
  .attr("width", width)
  .attr("height", height);

// Set up the scales for each dimension
var yScale = d3.scalePoint()
  .domain(Object.keys(data[0]).filter(function(d) { return d !== "Category"; }))
  .range([height, 0]); // <-- Adjusted range values

var xScales = {};
Object.keys(data[0]).filter(function(d) { return d !== "Category"; }).forEach(function(dim) {
  xScales[dim] = d3.scaleLinear()
    .domain(d3.extent(data, function(d) { return d[dim]; }))
    .range([0, width]); // <-- Adjusted range values
});

// Create the line generator
var line = d3.line()
  .defined(function(d) { return !isNaN(d[1]); })
  .x(function(d) { return xScales[d[0]](d[1]); })
  .y(function(d) { return yScale(d[0]); });

// Draw the parallel coordinates
var categories = data.map(function(d) { return d["Category"]; });

svg.selectAll(".line")
  .data(data)
  .enter().append("path")
  .attr("class", "line")
  .attr("d", function(d) {
    return line(Object.keys(d).map(function(dim) {
      return [dim, d[dim]];
    }));
  })
  .attr("stroke", function(d, i) { return d3.schemeCategory10[i % 10]; })
  .attr("fill", "none");