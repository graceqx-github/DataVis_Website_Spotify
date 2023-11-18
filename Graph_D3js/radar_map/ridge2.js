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
var categories = ['danceability', 'liveness_norm', 'tempo_norm', 'energy', 'valence', 'loudness_norm', 'speechiness_norm', 'acousticness_norm'];
var n = categories.length

d3.csv("../dataSource/dataset.csv").then(function(data) {
    console.log("data:",data)
    // Compute the mean of each group
    allMeans = []
    for (i in categories){
        currentGroup = categories[i]
        mean = d3.mean(data, function(d) { return d[currentGroup] })+i*10
        allMeans.push(mean)
    }

    console.log("All Means:", allMeans);


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
 
     // Add X axis label:
     svg.append("text")
         .attr("text-anchor", "end")
         .attr("x", width_ridge-100)
         .attr("y", height_ridge+45)
         .text("Normalized_value");
 
     console.log("X Axis Added");
 
    // Create a Y scale for densities
    var y = d3.scaleLinear()
    .domain([0, 1])
    .range([height_ridge, 0]);

    // Create the Y axis for names
    var yName = d3.scaleBand()
        .domain(categories)
        .range([0, height_ridge])
        .paddingInner(1)
    svg.append("g")
        .call(d3.axisLeft(yName).tickSize(0))
        .selectAll("text") // Select all text elements for the Y axis
        .attr("fill", "black") // Set text color to black
        .select(".domain").remove()

    console.log("Y Axis Added");

    // Create a color scale using these means.
    var myColor = d3.scaleSequential()
    .domain([0,100])
        .interpolator(d3.interpolateViridis);

    console.log("my color:", myColor);

    // Create a color scale using these means.
    var myColor = d3.scaleSequential()
        .domain([0,100])
        .interpolator(d3.interpolateViridis);


    // Compute kernel density estimation for each column:
    var kde = kernelDensityEstimator(kernelEpanechnikov(5), x.ticks(40)) // increase this 40 for more accurate density.
    var allDensity = []
    for (i = 0; i < n; i++) {
        key = categories[i]
        density = kde( data.map(function(d){  return d[key]; }) )
        allDensity.push({key: key, density: density})
    }

    console.log("All Density Calculated:", allDensity);

    // Add areas
    svg.selectAll("areas")
    .data(allDensity)
    .enter()
    .append("path")
        .attr("transform", function(d){return("translate(0," + (yName(d.key)-height_ridge) +")" )})
        .attr("fill", function(d){
        grp = d.key ;
        index = categories.indexOf(grp)
        value = allMeans[index]
        return myColor( value )
        })
        .datum(function(d){return(d.density)})
        .attr("opacity", 0.7)
        .attr("stroke", "#000")
        .attr("stroke-width", 0.1)
        .attr("d",  d3.line()
            .curve(d3.curveBasis)
            .x(function(d) { return x(d[0]); })
            .y(function(d) { return y(d[1]); })
        )
    
}).catch(function(error) {
    console.log(error);
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