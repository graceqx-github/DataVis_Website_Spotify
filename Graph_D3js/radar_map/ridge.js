// Set the dimensions and margins of the graph
var margin = {top: 80, right: 50, bottom: 70, left: 120},
    width_ridge = 480 - margin.left - margin.right,
    height_ridge = 400 - margin.top - margin.bottom;

// Append the svg object to the body of the page
var svg = d3.select("#ridge_chart")
  .append("svg")
    .attr("width", width_ridge + margin.left + margin.right)
    .attr("height", height_ridge + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// Read data
var categories = ['danceability', 'liveness_norm', 'tempo_norm', 'energy', 'valence', 'loudness_norm', 'speechiness_norm', 'acousticness_norm'];
var n = categories.length;

d3.csv("../dataSource/dataset.csv").then(function(data) {
    // Filter data by genre
    var selectedGenre = "world-map"; // Replace with your genre
    var filteredData = data.filter(function(d) {
        return d.new_genre === selectedGenre;
    });

    // Compute histograms for each category
    var histograms = categories.map(function(category) {
        var histogram = d3.histogram()
            .value(function(d) { return d[category]; })
            .domain(d3.extent(filteredData, function(d) { return d[category]; }))
            .thresholds(x.ticks(40)); // Adjust the number of bins

        return {
            category: category,
            bins: histogram(filteredData)
        };
    });

    // Add X axis
    var x = d3.scaleLinear()
        .domain([-10, 10]) // Adjusted to match normalized data range
        .range([0, width_ridge]);
    svg.append("g")
        .attr("class", "xAxis")
        .attr("transform", "translate(0," + height_ridge + ")")
        .call(d3.axisBottom(x).tickValues([0, 25, 50, 75, 100]).tickSize(-height_ridge))
        .selectAll("text")
        .attr("fill", "black")
        .select(".domain").remove();

    // Add X axis label
    svg.append("text")
        .attr("text-anchor", "end")
        .attr("x", width_ridge - 100)
        .attr("y", height_ridge + 45)
        .text("Normalized Value");

    // Create a Y scale for densities
    var y = d3.scaleLinear()
        .domain([0, 1])
        .range([height_ridge, 0]);

    // Create the Y axis for names
    var yName = d3.scaleBand()
        .domain(categories)
        .range([0, height_ridge])
        .paddingInner(1);
    svg.append("g")
        .call(d3.axisLeft(yName).tickSize(0))
        .selectAll("text")
        .attr("fill", "black")
        .select(".domain").remove();

    // Create a color scale
    var myColor = d3.scaleSequential()
        .domain([0, 100])
        .interpolator(d3.interpolateViridis);

    // Draw the histograms
    histograms.forEach(function(histogramData, i) {
        var category = histogramData.category;
        var bins = histogramData.bins;

        svg.selectAll(".bar-" + category)
            .data(bins)
            .enter().append("rect")
            .attr("class", "bar bar-" + category)
            .attr("x", 1)
            .attr("transform", function(d) { 
                return "translate(" + x(d.x0) + "," + yName(category) + ")"; 
            })
            .attr("width", function(d) { return x(d.x1) - x(d.x0) - 1; })
            .attr("height", function(d) { return y(d.length); }) // Use height to encode frequency
            .attr("fill", function(d) {
                return myColor(i * 10); // Assign color based on category index
            })
            .attr("opacity", 0.7);
    });

}).catch(function(error) {
    console.log(error);
});