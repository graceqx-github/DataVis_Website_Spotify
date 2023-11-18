function createParallelCoordinatesChart(dataset) {
      const para_width = 1200;
      const para_height = 600;
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
d3.csv('../dataSource/dataset.csv').then(data => {
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