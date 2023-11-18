// Generate random data for countries as an example
const allYearData = {};

function generateRandomHeatmapDataForYear(year) {
    const yearData = {};
    d3.json("https://d3js.org/world-110m.v1.json").then(world => {
        topojson.feature(world, world.objects.countries).features.forEach(d => {
            yearData[d.id] = Math.random();
        });
        allYearData[year] = yearData;
    });
}

for (let year = 2000; year <= 2023; year++) {
    generateRandomHeatmapDataForYear(year);
}
function customColor(t) {
    return d3.interpolateBlues(t * 0.8 + 0.05);  // This narrows the color range
  }

// Define a color scale for the heatmap
const colorScale = d3.scaleSequential(customColor)
    .domain([0, 1]);

// World Map
const svgMap = d3.select("#worldMap");
d3.json("https://d3js.org/world-110m.v1.json").then(world => {
    const projection = d3.geoMercator()
        .fitSize([800, 500], topojson.feature(world, world.objects.countries))
        .clipExtent([[0,0], [800, 350]]);  // This clips the rendering to exclude the poles

    const path = d3.geoPath().projection(projection);

    const countries = svgMap.selectAll("path")
        .data(topojson.feature(world, world.objects.countries).features)
        .enter().append("path")
        .attr("d", path)
        .attr("fill", d => {
            const value = allYearData[2000][d.id] || 0; // Default to the year 2000
            return colorScale(value);
        })
        .attr("stroke", "#333");

    // Update function for the heatmap based on the selected year
    function updateHeatmap(year) {
        countries.transition()
            .duration(500)
            .attr("fill", d => {
                const value = allYearData[year][d.id] || 0;
                return colorScale(value);
            });
    }

    // Event listener for the slider
    document.getElementById("yearSlider").addEventListener("input", function(event) {
        const selectedYear = event.target.value;
        document.getElementById("yearLabel").innerText = selectedYear;
        updateHeatmap(selectedYear);
    });
});


//Key
// Color Key
const svgKey = d3.select("#colorKey");
const keyWidth = 200;
const keyHeight = 10;

// Gradient for the key
const gradient = svgKey.append("defs")
    .append("linearGradient")
    .attr("id", "gradient")
    .attr("x1", "0%")
    .attr("y1", "0%")
    .attr("x2", "100%")
    .attr("y2", "0%");

gradient.append("stop")
    .attr("offset", "0%")
    .attr("stop-color", colorScale(0));

gradient.append("stop")
    .attr("offset", "100%")
    .attr("stop-color", colorScale(1));

// Draw the color key
svgKey.append("rect")
    .attr("x", 50)
    .attr("y", 10)
    .attr("width", keyWidth)
    .attr("height", keyHeight)
    .style("fill", "url(#gradient)");

// Add labels for the key
svgKey.append("text")
    .attr("x", 50)
    .attr("y", 40)
    .attr("fill", "#000")
    .text("Unpopular");
    

svgKey.append("text")
    .attr("x", 50 + keyWidth)
    .attr("y", 40)
    .attr("fill", "#000")
    .attr("text-anchor", "end")
    .text("Most Popular");