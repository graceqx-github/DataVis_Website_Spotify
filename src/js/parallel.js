
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
// var data = [
//   { "Category": "A", "Value1": 10, "Value2": 20, "Value3": 30 },
//   { "Category": "B", "Value1": 15, "Value2": 25, "Value3": 35 },
//   { "Category": "C", "Value1": 20, "Value2": 30, "Value3": 40 },
//   { "Category": "D", "Value1": 25, "Value2": 35, "Value3": 45 },
//   { "Category": "E", "Value1": 30, "Value2": 40, "Value3": 50 }
// ];

// // Set up the dimensions of the SVG container
// var width = 700;
// var height = 300;

// // Create the SVG container
// var svg = d3.select("#parallel")
//   .attr("width", width)
//   .attr("height", height);

// // Set up the scales for each dimension
// var yScale = d3.scalePoint()
//   .domain(Object.keys(data[0]).filter(function(d) { return d !== "Category"; }))
//   .range([height, 0]); // <-- Adjusted range values

// var xScales = {};
// Object.keys(data[0]).filter(function(d) { return d !== "Category"; }).forEach(function(dim) {
//   xScales[dim] = d3.scaleLinear()
//     .domain(d3.extent(data, function(d) { return d[dim]; }))
//     .range([0, width]); // <-- Adjusted range values
// });

// // Create the line generator
// var line = d3.line()
//   .defined(function(d) { return !isNaN(d[1]); })
//   .x(function(d) { return xScales[d[0]](d[1]); })
//   .y(function(d) { return yScale(d[0]); });

// // Draw the parallel coordinates
// var categories = data.map(function(d) { return d["Category"]; });

// svg.selectAll(".line")
//   .data(data)
//   .enter().append("path")
//   .attr("class", "line")
//   .attr("d", function(d) {
//     return line(Object.keys(d).map(function(dim) {
//       return [dim, d[dim]];
//     }));
//   })
//   .attr("stroke", function(d, i) { return d3.schemeCategory10[i % 10]; })
//   .attr("fill", "none");

function createParallelCoordinatesChart(dataset) {
  // const para_width = 1200;
  // const para_height = 600;
  const para_width = 600;
  const para_height = 300;
  const svg = d3.select('body').append('svg')
    .attr('width', para_width)
    .attr('height', para_height);
    

  
  const margin = { left: 50, top: 30, right: 30, bottom: 20 }

  const dimensions =  ['new_genre', 'danceability', 'liveness', 'tempo', 'energy', 'valence', 'popularity', 'speechiness_norm', 'acousticness'];

  // Count the genres and sort by frequency
  const genreCounts = new Map([...new Set(dataset.map(d => d.new_genre))].map(genre => [genre, 0]));
  dataset.forEach(d => genreCounts.set(d.new_genre, genreCounts.get(d.new_genre) + 1));
  const topGenres = new Set([...genreCounts.entries()].sort((a, b) => b[1] - a[1]).slice(0, 10).map(entry => entry[0]));

  // Filter dataset to only include top 10 genres
  const filteredDataset = dataset.filter(d => topGenres.has(d.new_genre));
  const data = filteredDataset.map(d => dimensions.map(dimension => d[dimension]))
    
  // Define your own color codes here
  const colorCodes = ['#2B4561', '#8F904E', '#7B928F', '#A1CCD9', '#D7CDBB', '#E5CEC6', '#EBC1C0', '#C99E8E', '#B08166', '#502F15'];
  const colorScale = d3.scaleOrdinal()
    .domain(topGenres)
    .range(colorCodes);


  // Use scalePoint because x-axis domain is discrete
  const xScale = d3.scalePoint()
    .range([margin.left, para_width - margin.right])
    .domain(dimensions)

  // Plot x-axis at the top, remove the line stroke
  svg.append('g')
    .call(d3.axisTop(xScale))
    .attr('transform', `translate(0,${margin.top})`)
    .selectAll('path')
      .attr('stroke', 'none')

  // Make one y-scale for each dimension
  const yScales = dimensions.map(dimension => {
    if (dimension === 'new_genre') {
      return d3.scalePoint()
        .range([para_height - margin.bottom, margin.top])
        .domain([...topGenres]);
    } else {
      return d3.scaleLinear()
        .range([para_height - margin.bottom, margin.top])
        .domain(d3.extent(filteredDataset.map(d => d[dimension])));
    }
  })

  // Plot axes for each dimension
  dimensions.forEach((dimension, i) => {
    svg.append('g')
      .call(d3.axisLeft(yScales[i]))
      .attr('transform', `translate(${xScale(dimension)},0)`)
  })

  // Line generator, carefully handle each dimension
  const line = d3.line()
    .x((d, i) => xScale(dimensions[i]))
    .y((d, i) => yScales[i](d))

  // Just like a line chart!
  const lines = svg.append('g')
    .selectAll('path')
    .data(data)
    .enter()
    .append('path')
      .attr('d', d => line(d))
      .attr('fill', 'none')
      .attr('stroke', d => colorScale(d[0])) // Use color scale based on genre
      .attr('stroke-opacity', 0.8)
      .attr('class', d => `line line-${d[0]}`) // Add class with genre for easy selection

  // Hover effect
  lines.on('mouseover', function(event, d) {
    // Highlight all lines with the same genre
    svg.selectAll(`.line-${d[0]}`)
      .attr('stroke-width', 3)
      .raise();

    // Unhighlight other genres
    svg.selectAll(`.line:not(.line-${d[0]})`)
      .attr('stroke-opacity', 0.1);
  })
  .on('mouseout', function(event, d) {
    // Reset all lines with the same genre
    svg.selectAll(`.line-${d[0]}`)
      .attr('stroke-width', 1);

    // Reset other genres
    svg.selectAll(`.line:not(.line-${d[0]})`)
      .attr('stroke-opacity', 0.5);
  })

  return svg.node()

}

function randomSample(data, sampleSize) {
const shuffledData = data.slice().sort(() => 0.5 - Math.random());
return shuffledData.slice(0, sampleSize);
}

// Load the data from the CSV file and call the function to create the chart
d3.csv('dataset.csv').then(data => {
console.log("data:",data);
// Convert numeric columns to numbers
data.forEach(d => {
  d.danceability = +d.danceability;
  d.liveness = +d.liveness;
  d.tempo = +d.tempo;
  d.energy = +d.energy;
  d.valence = +d.valence;
  d.popularity = +d.popularity;
  d.speechiness = +d.speechiness;
  d.acousticness = +d.acousticness;
});

// Call randomSample function to get a random subset of the data
const sampleSize = 4000; // Choose the sample size here
const sampledData = randomSample(data, sampleSize);

createParallelCoordinatesChart(sampledData);
}).catch(error => {
console.error('Error loading the data:', error);
});