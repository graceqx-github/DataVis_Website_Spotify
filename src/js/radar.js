var data = [
    {axis:"Base Attack", value: 50},
    {axis:"Base Defense", value: 75},
    {axis:"Base Stamina", value: 90},
  ];

var svg = d3.select("#radar")
  .attr("width", 500)
  .attr("height", 500);


var angleScale = d3.scalePoint()
  .domain(data.map(function(d) { return d.axis; }))
  .range([0, 2*Math.PI]);

var radiusScale = d3.scaleLinear()
  .domain([0, 100])
  .range([0, 200]);

var line = d3.lineRadial()
  .angle(function(d) { return angleScale(d.axis); })
  .radius(function(d) { return radiusScale(d.value); })
  .curve(d3.curveLinearClosed);

var area = d3.areaRadial()
  .angle(function(d) { return angleScale(d.axis); })
  .innerRadius(0)
  .outerRadius(function(d) { return radiusScale(d.value); })
  .curve(d3.curveLinearClosed);

var spider = svg.append("g")
  .attr("transform", "translate(250, 250)");

spider.append("path")
  .datum(data)
  .attr("d", area)
  .attr("fill", "rgba(255, 0, 0, 0.5)");

spider.append("path")
  .datum(data)
  .attr("d", line)
  .attr("stroke", "red")
  .attr("stroke-width", 2)
  .attr("fill", "none");

spider.selectAll("circle")
  .data(data)
  .enter()
  .append("circle")
  .attr("cx", function(d) { return radiusScale(d.value) * Math.sin(angleScale(d.axis)); })
  .attr("cy", function(d) { return radiusScale(d.value) * -Math.cos(angleScale(d.axis)); })
  .attr("r", 5)
  .attr("fill", "red");