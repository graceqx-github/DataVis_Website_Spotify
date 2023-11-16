var data = [
  {source:"Item 1", x: 50, y: 50, val: 10000, color: "#FF5733"},
  {source:"Item 2", x: 200, y: 60, val: 25000, color: "#FFC300"},
  {source:"Item 3", x: 350, y: 70, val: 40000, color: "#DAF7A6"},
  {source:"Item 4", x: 500, y: 80, val: 60000, color: "#C70039"},
  {source:"Item 5", x: 650, y: 90, val: 47500, color: "#D1C2E0"}
];

var svg = d3.select("#bubble")
  .attr("width", 1000)
  .attr("height", 200);

var bubbles = svg.selectAll("circle")
  .data(data)
  .enter()
  .append("circle")
  .attr("cx", function(d) { return d.x; })
  .attr("cy", function(d) { return d.y; })
  .attr("r", function(d) { return Math.sqrt(d.val) / Math.PI; })
  .attr("fill", function(d) { return d.color; });

  var labels = svg.selectAll("text")
  .data(data)
  .enter()
  .append("text")
  .text(function(d) { return d.source; })
  .attr("x", function(d) { return d.x; })
  .attr("y", function(d) { return d.y + 5; })
  .attr("text-anchor", "middle")
  .attr("font-size", "12px");