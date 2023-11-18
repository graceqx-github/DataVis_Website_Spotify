// Constants and initializations
const path= 'dataset.csv'
const radar_width = 400;
const radar_height = 500;
const radius = Math.min(radar_width, radar_height) / 2 - 20;
const svgRadar = d3.select("#radarChart");
const dimensions = ['danceability', 'liveness', 'tempo', 'energy', 'valence', 'popularity', 'speechiness', 'acousticness'];
const angleSlice = Math.PI * 2 / dimensions.length;
const genreColors = {
    "punk-rock": "rgb(187, 215, 239,0.7)",
    "pop": "rgb(136, 250, 132,0.7)",
    "acoustic": "rgb(236, 108, 108,0.7)"
};

// Initial Setup for Radar Chart
// Drawing radar circles
for (let i = 0; i < dimensions.length; i++) {
    const factor = radius / dimensions.length * (i + 1);
    svgRadar.append("circle")
        .attr("cx", radar_width/ 2)
        .attr("cy", radar_height / 2)
        .attr("r", factor)
        .attr("class", "radar-circle");
}

// Drawing radar lines and dimension names
dimensions.forEach((dim, i) => {
    const x = radar_width / 2 + radius * Math.cos(angleSlice * i - Math.PI / 2);
    const y = radar_height / 2 + radius * Math.sin(angleSlice * i - Math.PI / 2);

    // Radar lines
    svgRadar.append("line")
        .attr("x1", radar_width / 2)
        .attr("y1", radar_height / 2)
        .attr("x2", x)
        .attr("y2", y)
        .attr("class", "radar-line");

    // Dimension names
    svgRadar.append("text")
        .attr("x", x)
        .attr("y", y - 10)
        .attr("text-anchor", "middle")
        .attr("fill", "rgb(187, 215, 239)")
        .text(dim);
});

// Marks at the origin and top
svgRadar.append("text")
    .attr("x", radar_width / 2)
    .attr("y", radar_height / 2 + 15)
    .attr("text-anchor", "middle")
    .attr("fill", "rgb(0, 0, 0)")
    .attr("font-size", "10px")
    .text("0");

const topY = radar_height / 2 - radius;
svgRadar.append("text")
    .attr("x", radar_width / 2)
    .attr("y", topY - 5)
    .attr("text-anchor", "middle")
    .attr("fill", "rgb(0, 0, 0)")
    .attr("font-size", "10px")
    .text("1");

// Helper function to update and draw the radar for a specific genre
const drawRadarForGenre = (genre) => {
    d3.csv(path).then(data => {
        const genreData = data.filter(d => d.track_genre === genre);

        // Compute dimension mins and maxes
        const dimensionMins = {};
        const dimensionMaxs = {};
        dimensions.forEach(dim => {
            dimensionMins[dim] = d3.min(data, d => +d[dim]);
            dimensionMaxs[dim] = d3.max(data, d => +d[dim]);
        });

        // Compute average values for the selected genre
        const averages = {};
        dimensions.forEach(dim => {
            averages[dim] = d3.mean(genreData, d => +d[dim]);
        });
        
        // Compute normalized average coordinates for selected genre
        const lineGenerator = d3.line().curve(d3.curveLinearClosed);
        const averagePoints = dimensions.map((dim, i) => {
            const value = (averages[dim] - dimensionMins[dim]) / (dimensionMaxs[dim] - dimensionMins[dim]);
            const x = radar_width / 2 + radius * value * Math.cos(angleSlice * i - Math.PI / 2);
            const y = radar_height / 2 + radius * value * Math.sin(angleSlice * i - Math.PI / 2);
            return [x, y];
        });

        // Existing polygon removal with transition
        svgRadar.selectAll(".polygon-genre").transition().duration(200).style("opacity", 0.1).remove();
        
        // When drawing the new polygon:
        svgRadar.append("path")
        .attr("d", lineGenerator(averagePoints))
        .attr("class", "polygon-genre")
        .attr("fill", genreColors[genre])
        .style("opacity", 0.3)
        .transition()
        .duration(200)
        .style("opacity", 1);
    });
};
//draw all together
let allGenresDrawn = false; // A flag to check if all genres are currently drawn

const drawAllGenres = () => {
    if (allGenresDrawn) {
        // If all genres are currently drawn, remove them with a transition
        svgRadar.selectAll(".polygon-genre")
            .transition()
            .duration(500)
            .style("opacity", 0)
            .remove();
        allGenresDrawn = false;
    } else {
        d3.csv("dataset.csv").then(data => {
            ["punk-rock", "pop", "acoustic"].forEach(genre => {
                const genreData = data.filter(d => d.track_genre === genre);

                // Compute dimension mins and maxes
                const dimensionMins = {};
                const dimensionMaxs = {};
                dimensions.forEach(dim => {
                    dimensionMins[dim] = d3.min(data, d => +d[dim]);
                    dimensionMaxs[dim] = d3.max(data, d => +d[dim]);
                });

                // Compute average values for the selected genre
                const averages = {};
                dimensions.forEach(dim => {
                    averages[dim] = d3.mean(genreData, d => +d[dim]);
                });

                // Compute normalized average coordinates for selected genre
                const lineGenerator = d3.line().curve(d3.curveLinearClosed);
                const averagePoints = dimensions.map((dim, i) => {
                    const value = (averages[dim] - dimensionMins[dim]) / (dimensionMaxs[dim] - dimensionMins[dim]);
                    const x = radar_width / 2 + radius * value * Math.cos(angleSlice * i - Math.PI / 2);
                    const y = radar_height / 2 + radius * value * Math.sin(angleSlice * i - Math.PI / 2);
                    return [x, y];
                });

                // Draw the polygon for the genre with a transition
                svgRadar.append("path")
                    .attr("d", lineGenerator(averagePoints))
                    .attr("class", "polygon-genre")
                    .attr("fill", genreColors[genre])
                    .style("opacity", 0) // Start with opacity 0
                    .transition()
                    .duration(500)
                    .style("opacity", 0.3); // Transition to opacity 0.3
            });
            allGenresDrawn = true;
        });
    }
};



// Draw the radar for a default genre initially
drawRadarForGenre("punk-rock");



// Interaction: Attach click event listeners to the genre controls
document.querySelectorAll('.genre-controls label').forEach(label => {
    label.addEventListener('click', function() {
        const genre = this.getAttribute('data-genre');
        if (genre === "all-genres") {
            drawAllGenres();
        } else {
            drawRadarForGenre(genre);
        }
    });
});