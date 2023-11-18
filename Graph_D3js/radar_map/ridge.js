// set the dimensions and margins of the graph
var margin = {top: 80, right: 50, bottom: 70, left:120},
    width_ridge = 480 - margin.left - margin.right,
    height_ridge = 400 - margin.top - margin.bottom;

// append the svg object to the body of the page
var svg = d3.select("#ridge_chart")
  .append("svg")
    .attr("width", width_ridge + margin.left + margin.right)
    .attr("height", height_ridge + margin.top + margin.bottom)
  .append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");

console.log("SVG Appended");
//read data
var categories = ['danceability', 'liveness', 'tempo', 'energy', 'valence', 'popularity', 'speechiness', 'acousticness'];
var n = categories.length

// Read data
d3.csv("data/merged_data.csv").then(function(data) {
    // Create a Y scale for categories
    var yName = d3.scaleBand()
        .domain(categories)
        .range([0, height_ridge])
        .paddingInner(1);
    svg.append("g")
        .call(d3.axisLeft(yName).tickSize(0))
        .selectAll("text")
        .attr("fill", "black")
        .select(".domain").remove();

    // Compute histograms for each category
    var histograms = categories.map(function(category) {
        var histogram = d3.histogram()
            .value(function(d) { return +d[category]; })
            .domain([0, 1]) // Assuming normalized data
            .thresholds(40); // Number of bins

        return {
            category: category,
            bins: histogram(data)
        };
    });

    // Create a color scale
    var colorScale = d3.scaleOrdinal(d3.schemeCategory10)
        .domain(categories);

    // Draw the histograms
    histograms.forEach(function(histogramData, i) {
        var category = histogramData.category;
        var bins = histogramData.bins;

        svg.selectAll(".bar-" + category)
            .data(bins)
            .enter().append("rect")
            .attr("class", "bar bar-" + category)
            .attr("x", function(d) { return x(d.x0); })
            .attr("y", function(d) { return yName(category) + (height_ridge / categories.length - y(d.length)); })
            .attr("width", function(d) { return x(d.x1) - x(d.x0) - 1; })
            .attr("height", function(d) { return y(d.length); })
            .attr("fill", colorScale(category))
            .style("opacity", 0.6); // Adjust for transparency
    });

    // Add X axis
    var x = d3.scaleLinear()
        .domain([0, 1]) // Adjusted to match normalized data range
        .range([0, width_ridge]);
    svg.append("g")
        .attr("transform", "translate(0," + height_ridge + ")")
        .call(d3.axisBottom(x).tickValues([0, 0.25, 0.5, 0.75, 1]).tickSize(-height_ridge))
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
        .domain([0, d3.max(histograms, h => d3.max(h.bins, bin => bin.length))])
        .range([height_ridge / categories.length, 0]);
});


// This is what I need to compute kernel density estimation
function kernelDensityEstimator(kernel, X) {
  return function(V) {
    return X.map(function(x) {
      return [x, d3.mean(V, function(v) { return kernel(x - v); })];
    });
  };
}


function kernelEpanechnikov(k) {
  return function(v) {
    return Math.abs(v /= k) <= 1 ? 0.75 * (1 - v * v) / k : 0;
  };
}


function normalizeData(data, categories) {
    // Initialize an object to store the mean and standard deviation for each category
    var stats = {};
    categories.forEach(function(category) {
        stats[category] = {
            mean: d3.mean(data, function(d) { return +d[category]; }),
            std: d3.deviation(data, function(d) { return +d[category]; })
        };
    });

    // Normalize the data
    var normalizedData = data.map(function(d) {
        var normalized = {};
        categories.forEach(function(category) {
            if (stats[category].std !== 0) {
                normalized[category] = (+d[category] - stats[category].mean) / stats[category].std;
            } else {
                normalized[category] = 0; // In case of zero standard deviation
            }
        });
        return normalized;
    });

    return normalizedData;
}
/***
// Function to generate random data
function generateRandomData(numPoints, categories) {
    var data = [];
    for (var i = 0; i < numPoints; i++) {
      var dataPoint = {};
      categories.forEach(function(category,index) {
        // Generate random values; adjust the range as needed
        dataPoint[category] = Math.random() * 10*index+index*3;
      });
      data.push(dataPoint);
    }
    console.log("Random Data Generated:", data);
    return data;
  }
  ***/