import * as d3 from "d3";

let squares = d3.selectAll("rect");
squares.style("fill", "red");

d3.select("body")
    .append("svg")
    .append("rect")
    .attr("width", 50)
    .attr("height", 200)
    .style("fill", "red");