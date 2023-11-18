import { eig } from 'd3-linalg';

data = FileAttachment("dataset.csv").csv({typed: true});

console.log("data",data);

const numericData = data.map(d => [
  +d.danceability,
  +d.liveness_norm,
  +d.tempo_norm,
  +d.energy,
  +d.valence,
  +d.loudness_norm,
  +d.speechiness_norm,
  +d.acousticness_norm,
]);

const covarianceMatrix = d3.transpose(numericData).map(row => d3.transpose(numericData).map(col => d3.sum(d3.zip(row, col).map(([a, b]) => (a - d3.mean(row)) * (b - d3.mean(col))))));

const {values, vectors} = eig(covarianceMatrix);

const projectionMatrix = vectors.slice(0, 2);

const reducedData = numericData.map(row => d3.transpose(projectionMatrix).map(vec => d3.sum(d3.zip(row, vec).map(([a, b]) => a * b))));

const margin = { top: 10, right: 30, bottom: 30, left: 60 },
  width = 460 - margin.left - margin.right,
  height = 400 - margin.top - margin.bottom;

const svg = d3.select('#chart')
  .attr('viewBox', [0, 0, width + margin.left + margin.right, height + margin.top + margin.bottom])
  .append('g');

const x = d3.scaleLinear().domain(d3.extent(reducedData, d => d[0])).range([margin.left, width - margin.right]);
const y = d3.scaleLinear().domain(d3.extent(reducedData, d => d[1])).range([height - margin.bottom, margin.top]);

svg.append('g').attr('transform', `translate(0, ${height - margin.bottom})`).call(d3.axisBottom(x));
svg.append('g').attr('transform', `translate(${margin.left}, 0)`).call(d3.axisLeft(y));

svg.append('g')
  .selectAll('circle')
  .data(reducedData)
  .join('circle')
  .attr('cx', d => x(d[0]))
  .attr('cy', d => y(d[1]))
  .attr('r', 5)
  .attr('fill', 'steelblue');
  