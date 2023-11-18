const allYearData = {};

function generateRandomHeatmapDataForYear(year) {
    const yearData = {};
    // Placeholder for generating random data for each country
    // You can replace this with actual data loading logic
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