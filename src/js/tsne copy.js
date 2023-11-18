// const svg_tsne = d3.select("#tsne");

// const data_tsne = Array.from({ length: 50 }, () => ({
//   x: Math.random() * 500,
//   y: Math.random() * 300
// }));

// const circles = svg_tsne.selectAll("circle")
//   .data(data_tsne)
//   .enter()
//   .append("circle")
//   .attr("cx", d => d.x)
//   .attr("cy", d => d.y)
//   .attr("r", 5)
//   .attr("fill", "steelblue");

// {
//   const height = 600
//   const svg = d3.select(DOM.svg(width, height))
  
//   const margin = { left: 30, top: 10, right: 10, bottom: 20 }
  
//   const xScale = d3.scaleLinear()
//     .range([margin.left, width - margin.right])
//     .domain(d3.extent(dataset.map(d => d.x)))
  
//   svg.append('g')
//     .call(d3.axisBottom(xScale))
//     .attr('transform', `translate(0,${height - margin.bottom})`)
  
//   const yScale = d3.scaleLinear()
//     .range([height - margin.bottom, margin.top])
//     .domain(d3.extent(dataset.map(d => d.y)))
  
//   svg.append('g')
//     .call(d3.axisLeft(yScale))
//     .attr('transform', `translate(${margin.left},0)`)
  
//   svg.selectAll('circle')
//     .data(dataset)
//     .enter()
//     .append('circle')
//       // Circles are distributed across x-axis
//       .attr('cx', d => xScale(d.x))
//       // Across y-axis as well, and it becomes two dimensional
//       .attr('cy', d => yScale(d.y))
//       .attr('r', 10)
//       .attr('fill', 'SteelBlue')
  
//   return svg.node()
// }


// set the dimensions and margins of the graph
const margin = {top: 10, right: 30, bottom: 30, left: 60},
    width = 460 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;

// append the svg object to the body of the page
const svg = d3.select("#my_dataviz")
  .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform",
          `translate(${margin.left}, ${margin.top})`);

//Read the data
d3.csv("https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/iris.csv").then( function(data) {

  // Add X axis
  const x = d3.scaleLinear()
    .domain([4, 8])
    .range([ 0, width ]);
  svg.append("g")
    .attr("transform", `translate(0, ${height})`)
    .call(d3.axisBottom(x));

  // Add Y axis
  const y = d3.scaleLinear()
    .domain([0, 9])
    .range([ height, 0]);
  svg.append("g")
    .call(d3.axisLeft(y));

  // Color scale: give me a specie name, I return a color
  const color = d3.scaleOrdinal()
    .domain(["setosa", "versicolor", "virginica" ])
    .range([ "#440154ff", "#21908dff", "#fde725ff"])


  // Highlight the specie that is hovered
  const highlight = function(event,d){

    selected_specie = d.Species

    d3.selectAll(".dot")
      .transition()
      .duration(200)
      .style("fill", "lightgrey")
      .attr("r", 3)

    d3.selectAll("." + selected_specie)
      .transition()
      .duration(200)
      .style("fill", color(selected_specie))
      .attr("r", 7)
  }

  // Highlight the specie that is hovered
  const doNotHighlight = function(event,d){
    d3.selectAll(".dot")
      .transition()
      .duration(200)
      .style("fill", d => color(d.Species))
      .attr("r", 5 )
  }

  // Add dots
  svg.append('g')
    .selectAll("dot")
    .data(data)
    .enter()
    .append("circle")
      .attr("class", function (d) { return "dot " + d.Species } )
      .attr("cx", function (d) { return x(d.Sepal_Length); } )
      .attr("cy", function (d) { return y(d.Petal_Length); } )
      .attr("r", 5)
      .style("fill", function (d) { return color(d.Species) } )
    .on("mouseover", highlight)
    .on("mouseleave", doNotHighlight )

})



// // 1. 读取数据
// async function readData() {
//   const data = await d3.csv("dataset.csv");
//   return data.map(d => ({
//     danceability: +d.danceability,
//     liveness_norm: +d.liveness_norm,
//     tempo_norm: +d.tempo_norm,
//     energy: +d.energy,
//     valence: +d.valence,
//     loudness_norm: +d.loudness_norm,
//     speechiness_norm: +d.speechiness_norm,
//     acousticness_norm: +d.acousticness_norm
//   }));
// }

// // 2. 随机抽取300行数据
// function sampleData(data) {
//   return d3.shuffle(data).slice(0, 300);
// }

// // 3. 降维处理
// async function reduceDimensions(data) {
//   const pca = new PCA();
//   const reducedData = pca.fit(data).project(data, 2);
//   return reducedData.map((d, i) => ({
//     x: d[0],
//     y: d[1],
//     label: data[i].label
//   }));
// }

// // 4. 绘制图表
// function plotData(data) {
//   const margin = { top: 10, right: 30, bottom: 30, left: 60 },
//     width = 460 - margin.left - margin.right,
//     height = 400 - margin.top - margin.bottom;

//   const svg = d3
//     .select("#my_dataviz")
//     .append("svg")
//     .attr("width", width + margin.left + margin.right)
//     .attr("height", height + margin.top + margin.bottom)
//     .append("g")
//     .attr("transform", `translate(${margin.left}, ${margin.top})`);

//   const x = d3.scaleLinear().domain([-10, 10]).range([0, width]);
//   const y = d3.scaleLinear().domain([-10, 10]).range([height, 0]);

//   svg.append("g").attr("transform", `translate(0, ${height})`).call(d3.axisBottom(x));
//   svg.append("g").call(d3.axisLeft(y));

//   svg
//     .selectAll("circle")
//     .data(data)
//     .enter()
//     .append("circle")
//     .attr("cx", d => x(d.x))
//     .attr("cy", d => y(d.y))
//     .attr("r", 5)
//     .attr("fill", "steelblue");
// }

// // 5. 主函数
// (async function main() {
//   const rawData = await readData();
//   const sampledData = sampleData(rawData);
//   const reducedData = await reduceDimensions(sampledData);
//   plotData(reducedData);
// })();