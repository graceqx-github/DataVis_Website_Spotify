const svg_tsne = d3.select("#tsne");

const data_tsne = Array.from({ length: 50 }, () => ({
  x: Math.random() * 500,
  y: Math.random() * 300
}));

const circles = svg_tsne.selectAll("circle")
  .data(data_tsne)
  .enter()
  .append("circle")
  .attr("cx", d => d.x)
  .attr("cy", d => d.y)
  .attr("r", 5)
  .attr("fill", "steelblue");