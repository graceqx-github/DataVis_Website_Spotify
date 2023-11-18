// Set the dimensions and margins of the graph
var parallel_margin = {top: 30, right: 50, bottom: 10, left: 50},
  parallel_width = 960 - parallel_margin.left - parallel_margin.right,
  parallel_height = 500 - parallel_margin.top - parallel_margin.bottom;

// Append the svg object to the div
var parallel_svg = d3.select("#parallel_chart")
.append("svg")
  .attr("width", parallel_width + parallel_margin.left + parallel_margin.right)
  .attr("height", parallel_height + parallel_margin.top + parallel_margin.bottom)
.append("g")
  .attr("transform", "translate(" + parallel_margin.left + "," + parallel_margin.top + ")");

// List of dimensions
var parallel_dimensions = ['danceability', 'liveness', 'tempo', 'energy', 'valence', 'popularity', 'speechiness', 'acousticness'];

// Color scale for different genres
var parallel_genreColor = d3.scaleOrdinal()
  .domain(['pop', 'punk rock', 'acoustic'])
  .range(["#e41a1c", "#377eb8", "#4daf4a"]);

// Generate mock data with genres
var parallel_data = generateMockData(100, parallel_dimensions);

// Build and scale per dimension
var parallel_y = {};
parallel_dimensions.forEach(function(dim) {
  parallel_y[dim] = d3.scaleLinear()
    .domain(d3.extent(parallel_data, function(d) { return +d[dim]; }))
    .range([parallel_height, 0]);
});

// Build the X scale -> find the best position for each Y axis
var parallel_x = d3.scalePoint()
  .range([0, parallel_width])
  .domain(parallel_dimensions);

// Draw the lines
parallel_svg.selectAll("myPath")
  .data(parallel_data)
  .enter().append("path")
    .attr("class", function(d) { return "line " + d.genre.replace(/\s+/g, ''); }) // Remove spaces for class names
    .attr("d", parallel_path)
    .style("fill", "none")
    .style("stroke", function(d) { return parallel_genreColor(d.genre); })
    .style("opacity", 0.5)
    .on("mouseover", parallel_highlight)
    .on("mouseleave", parallel_doNotHighlight);

// Draw the axis
parallel_svg.selectAll("myAxis")
  .data(parallel_dimensions).enter()
  .append("g")
    .attr("class", "axis")
    .attr("transform", function(d) { return "translate(" + parallel_x(d) + ")"; })
    .each(function(d) { d3.select(this).call(d3.axisLeft().scale(parallel_y[d])); })
    .append("text")
      .style("text-anchor", "middle")
      .attr("y", -9)
      .text(function(d) { return d; })
      .style("fill", "black");

// Path function to draw lines
function parallel_path(d) {
  return d3.line()(parallel_dimensions.map(function(p) { return [parallel_x(p), parallel_y[p](d[p])]; }));
}

// Function to generate mock data with genres
function generateMockData(numRecords, dimensions) {
    var genres = ['pop', 'punk rock', 'acoustic'];
    var data = [];
    for (var i = 0; i < numRecords; i++) {
      var record = { genre: genres[i % genres.length] }; // Cycle through genres
      dimensions.forEach(function(dim) {
        record[dim] = Math.random() * 10; // Random value between 0 and 10
      });
      data.push(record);
    }
    return data;
  }

// Highlight function based on genre
function parallel_highlight(d) {
  var selected_genre = d.genre;

  // Dim all lines
  d3.selectAll(".line")
    .transition().duration(200)
    .style("stroke", "lightgrey")
    .style("opacity", "0.2");

  // Highlight the lines of the selected genre
  d3.selectAll("." + selected_genre)
    .transition().duration(200)
    .style("stroke", parallel_genreColor(selected_genre))
    .style("opacity", "1");
}

// Unhighlight function
function parallel_doNotHighlight() {
  d3.selectAll(".line")
    .transition().duration(200).delay(1000)
    .style("stroke", function(d) { return parallel_genreColor(d.genre); })
    .style("opacity", "0.5");
}
