    // set the dimensions and margins of the graph
    const margin = {top: 10, right: 20, bottom: 30, left: 50},
        width = 500 - margin.left - margin.right,
        height = 420 - margin.top - margin.bottom;
        // width = 500,
        // height =300;
    
    // append the svg object to the body of the page
    
    const svg = d3.select("#tsne")
      .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
      .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);
    
    //Read the data
    d3.csv("./new_dataset.csv").then( function(data) {
    
        // Add X axis
        const x = d3.scaleLinear()
            .domain([-0.05, 0.05])
            .range([ 0, width ]);
        svg.append("g")
            .attr("transform", `translate(0, ${height})`)
            .call(d3.axisBottom(x));
        
        // Add Y axis
        const y = d3.scaleLinear()
            .domain([-0.035, 0.015])
            .range([ height, 0]);
        svg.append("g")
            .call(d3.axisLeft(y));
        
        // Add a scale for bubble size
        const z = d3.scaleLinear()
            .domain([50, 4000])
            .range([3, 60]);
        
        // Add a scale for bubble color
        var myColor = d3.scaleOrdinal()
            .domain(['world-music', 'electronic', 'rock', 'metal', 'j-pop', 'kids', 'honky-tonk', 'indie', 'soundtracks', 'reggae'])
            .range(d3.schemeSet3);

        // -1- Create a tooltip div that is hidden by default:
        var tooltip = d3.select("#my_dataviz")
            .append("div")
            .style("opacity", 0)
            .attr("class", "tooltip")
            .style("background-color", "black")
            .style("border-radius", "5px")
            .style("padding", "10px")
            .style("color", "white")
            
        const showTooltip = function(event, d) {
            const [x, y] = d3.pointer(event);
            tooltip
            .transition()
            .duration(200)
            tooltip
            .style("opacity", 0.3)
            .html("Country: " + d.new_genre)
            .style("left", (event.x)/2 + "px")
            .style("top", (event.y)/2+30 + "px")
        }
        const moveTooltip = function(event, d) {
            const [x, y] = d3.pointer(event);
            tooltip
            .style("left", (event.x)/2 + "px")
            .style("top", (event.y)/2+30 + "px")
        }
        const hideTooltip = function(event, d) {
            tooltip
            .transition()
            .duration(200)
            .style("opacity", 0)
        }
        
        // Add dots
        svg.append('g')
            .selectAll("dot")
            .data(data)
            .join("circle")
            .attr("class", "bubbles")
            .attr("cx", d => x(d.mean_pca1))
            .attr("cy", d => y(d.mean_pca2))
            .attr("r", d => z(d.radius))
            //   .style("fill", "#69b3a2")
            .style("opacity", "0.7")
            //   .attr("stroke", "black")
            .style("fill", d => myColor(d.new_genre))
            // -3- Trigger the functions
            .on("mouseover", showTooltip )
            .on("mousemove", moveTooltip )
            .on("mouseleave", hideTooltip )
        
    }).catch(function(error) {
        console.error("Error loading dataset:", error);
    });