// Generate random data for countries as an example
let allYearData = {};
let yearData={};


function generateBaseForYear(year) {
    const yearData = {};
    d3.json("https://d3js.org/world-110m.v1.json").then(world => {
        topojson.feature(world, world.objects.countries).features.forEach(d => {
            yearData[d.id] = 0.0; //Math.random();
        });
        allYearData[year] = yearData;
    });
}

function generateHeatmapDataForYear(year) {
    datasets = []
    d3.csv("dataset.csv").then(function(dataset) {
        kpop_data = dataset.filter((obj) => obj.new_genre===new_genre)
        .filter((obj)=>obj.release_date.split("/")[2]===year.toString());
        groupedData = kpop_data.reduce((acc, obj) => {
            key = obj.Numeric;
            if (!acc[key]) {
                acc[key] = { Numeric: key, popularity: 0, count: 0 };
            }
            acc[key].popularity += +obj.popularity;
            acc[key].count++;
            return acc;
        }, {});

        result = Object.values(groupedData).map((group) => ({
            Numeric: group.Numeric,
            popularity: group.popularity / group.count / 100,
        }));

        yearData = allYearData[year]
        result.forEach(function(element){
            yearData[element.Numeric] = element.popularity
        })
        allYearData[year] = yearData;
      }).then(()=>{})
    ;
}


function generateData(){
    for (let year = 2000; year <= 2023; year++) {
        generateBaseForYear(year);
        generateHeatmapDataForYear(year);
    }
}






// Define a color scale for the heatmap
const colorScale = d3.scaleLinear()
.domain([0, 1])
.interpolate(d3.interpolateHcl)
.range([d3.rgb(nonColor), d3.rgb(fulColor).darker()])

// World Map
const svgMap = d3.select("#worldMap");

generateData()

d3.json("https://d3js.org/world-110m.v1.json").then(world => {
    const projection = d3.geoMercator().fitSize([900, 700], topojson.feature(world, world.objects.countries)).clipExtent([[0,0], [900, 700]]);
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