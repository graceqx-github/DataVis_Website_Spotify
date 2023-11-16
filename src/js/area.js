const svg_area = d3.select("#area");

const data_area = [
  { year: "2000", A: 10, B: 20, C: 30 },
  { year: "2001", A: 20, B: 30, C: 40 },
  { year: "2002", A: 30, B: 40, C: 50 },
  { year: "2003", A: 40, B: 50, C: 60 },
  { year: "2004", A: 30, B: 65, C: 60 },
  { year: "2005", A: 50, B: 60, C: 70 },
  { year: "2006", A: 50, B: 60, C: 70 },
  { year: "2007", A: 40, B: 20, C: 80 },
  { year: "2008", A: 40, B: 50, C: 80 },
];

const stack = d3.stack().keys(["A", "B", "C"]);
const series = stack(data_area);

const x = d3.scaleBand()
  .domain(data_area.map(d => d.year))
  .range([0, 1570])
  .padding(0.3);

const y = d3.scaleLinear()
  .domain([0, d3.max(series, d => d3.max(d, d => d[1]))])
  .range([400, 0]);

const color = d3.scaleOrdinal()
  .domain(["A", "B", "C"])
  .range(["#6baed6", "#3182bd", "#08519c"]);

const area = d3.area()
  .x(d => x(d.data.year))
  .y0(d => y(d[0]))
  .y1(d => y(d[1]));

const groups = svg_area.selectAll("g")
  .data(series)
  .enter()
  .append("g")
  .attr("fill", d => color(d.key));

groups.selectAll("path")
  .data(d => [d])
  .enter()
  .append("path")
  .attr("d", area);