// Constants and initializations for Radar Chart
const radarPath = 'data/spotify_dataset_1_bruce.csv'; // Adjust the path to your dataset
const radarWidth = 400;
const radarHeight = 500;
const radarRadius = Math.min(radarWidth, radarHeight) / 2 - 20;
const radarSvg = d3.select("#radarChart");
const radarDimensions = ['danceability', 'liveness_norm', 'tempo_norm', 'energy', 'valence', 'loudness_norm', 'speechiness_norm', 'acousticness_norm'];
const radarAngleSlice = Math.PI * 2 / radarDimensions.length;
const radarGenreColors = {
    "punk": "rgb(187, 215, 239,0.7)",
    "pop": "rgb(136, 250, 132,0.7)",
    "acoustic": "rgb(236, 108, 108,0.7)",
    'world-music':"rgb(229, 206, 198)"
};
const radarStrokeColors = {
    'world-music':"rgb(239, 216, 208)"
}

// Current genre selection
let currentGenre = "world-music"; // Default genre

// Initial Setup for Radar Chart
// Drawing radar circles
for (let i = 0; i < radarDimensions.length; i++) {
    const factor = radarRadius / radarDimensions.length * (i + 1);
    radarSvg.append("circle")
        .attr("cx", radarWidth / 2)
        .attr("cy", radarHeight / 2)
        .attr("r", factor)
        .attr("class", "radar-circle");
}
console.error("initialize");
// Drawing radar lines and dimension names
radarDimensions.forEach((dim, i) => {
    const x = radarWidth / 2 + radarRadius * Math.cos(radarAngleSlice * i - Math.PI / 2);
    const y = radarHeight / 2 + radarRadius * Math.sin(radarAngleSlice * i - Math.PI / 2);

    // Radar lines
    radarSvg.append("line")
        .attr("x1", radarWidth / 2)
        .attr("y1", radarHeight / 2)
        .attr("x2", x)
        .attr("y2", y)
        .attr("class", "radar-line");

    // Dimension names
    radarSvg.append("text")
        .attr("x", x)
        .attr("y", y - 10)
        .attr("text-anchor", "middle")
        .attr("fill", "rgb(187, 215, 239)")
        .text(dim);
});
console.error("initialize");
// Helper function to update and draw the radar for a specific year and genre
const drawRadarForGenre = (year, genre) => {
    radarSvg.selectAll(".polygon-genre").remove(); // Clear existing chart

    d3.csv(radarPath).then(data => {
        // Filter data based on the selected year and genre
        const filteredData = data.filter(d => {
            const releaseYear = d.release_date.split('/')[2];
            return releaseYear === year && d.new_genre === genre;
        });
        console.log("filteredData:",filteredData);
        // Compute average values for the selected genre
        const averages = {};
        radarDimensions.forEach(dim => {
            averages[dim] = d3.mean(filteredData, d => +d[dim]);
        });
        console.log("Averages:", averages);

        // Compute normalized average coordinates for selected genre
        const lineGenerator = d3.line().curve(d3.curveLinearClosed);
        const averagePoints = radarDimensions.map((dim, i) => {
            const value = averages[dim];
            const x = radarWidth / 2 + radarRadius * value * Math.cos(radarAngleSlice * i - Math.PI / 2);
            const y = radarHeight / 2 + radarRadius * value * Math.sin(radarAngleSlice * i - Math.PI / 2);
            return [x, y];
        });

        // Update radar chart
        radarSvg.selectAll(".polygon-genre").remove();
        radarSvg.append("path")
            .attr("d", lineGenerator(averagePoints))
            .attr("class", "polygon-genre")
            .attr("fill", radarGenreColors[genre])
            .attr("stroke", d3.rgb(radarGenreColors[genre]).darker())
            .attr("stroke-width", 5)
            .style("opacity", 0.7)
            .transition()
            .duration(500);
    });
};

// Event listener for the time slider
document.getElementById("yearSlider").addEventListener("input", function(event) {
    const selectedYear = event.target.value;
    document.getElementById("yearLabel").innerText = selectedYear;
    if (currentGenre === "all-genres") {
        drawAllGenres(selectedYear);
    } else {
        drawRadarForGenre(selectedYear, currentGenre);
    }
});


// Initial radar chart for a default year and genre
drawRadarForGenre("2000", currentGenre);