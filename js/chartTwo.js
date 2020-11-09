import * as d3 from "d3";


const margin = ({top: 20, right: 20, bottom: 30, left: 30});
const height = 300
const width = 300

const data = [
    {date: new Date(1988,1,1), value: 12681, downBorder: 12100},
    {date: new Date(1988,1,2), value: 13264, downBorder: 12200},
    {date: new Date(1988,1,3), value: 13953, downBorder: 1200},
    {date: new Date(1988,1,4), value: 13921, downBorder: 1200},
    {date: new Date(1988,1,5), value: 13932, downBorder: 1200},
    {date: new Date(1988,1,6), value: 13157, downBorder: 1200},
    {date: new Date(1988,1,7), value: 11159, downBorder: 1200},
    {date: new Date(1988,1,8), value: 11631, downBorder: 1200},
    {date: new Date(1988,1,9), value: 12045, downBorder: 1200},
    {date: new Date(1988,1,10), value: 13160, downBorder: 1200},
    {date: new Date(1988,1,11), value: 14240, downBorder: 1200},
    {date: new Date(1988,1,12), value: 14302, downBorder: 1200},
    {date: new Date(1988,1,13), value: 14353, downBorder: 1200},
    {date: new Date(1988,1,14), value: 14451, downBorder: 1200},
    {date: new Date(1988,1,15), value: 14496, downBorder: 1200},
    {date: new Date(1988,1,16), value: 13041, downBorder: 1200},
    {date: new Date(1988,1,17), value: 13337, downBorder: 1200},
    {date: new Date(1988,1,18), value: 12396, downBorder: 1200},
    {date: new Date(1988,1,19), value: 13721, downBorder: 1200},
    {date: new Date(1988,1,20), value: 13745, downBorder: 1200}];

const x = d3.scaleUtc()
    .domain(d3.extent(data, d => d.date))
    .range([margin.left, width - margin.right])

const y = d3.scaleLinear()
    .domain([0, d3.max(data, d => d.value)]).nice()
    .range([height - margin.bottom, margin.top])

const xAxis = (g, x) => g
    .attr("transform", `translate(0,${height - margin.bottom})`)
    .call(d3.axisBottom(x).ticks(width / 80).tickSizeOuter(0))  //.tickSizeOuter(0) - описывает "черточки" по краям оси
                                                                //соответственно .ticks отвечает за все "черточки"

const yAxis = (g, y) => g
    .attr("transform", `translate(${margin.left},0)`)
    .call(d3.axisLeft(y).ticks(null, "s"))
    .call(g => g.select(".domain").remove())
    .call(g => g.select(".tick:last-of-type text").clone()
        .attr("x", 3)
        .attr("text-anchor", "start")
        .attr("font-weight", "bold")
        .text(data.y))



const chart = function () {
    const svg = d3.select("body.two").append("svg")
        .attr("viewBox", [0, 0, width, height]);

    const g = svg.append("g");

    g.selectAll("line")
        .data(data)
        .join("line")
        .attr("x1", d => x(d.date))
        .attr("x2", d => x(d.date))
        .attr("y1", 0)
        .attr("y2", d => y(d.value))
        .attr("style", "stroke:rgb(255,0,0);stroke-width:2");

    g.append("g")
        .attr("fill", "none")
        .attr("pointer-events", "all")
        .selectAll("rect")
        .data(d3.pairs(data))
        .join("rect")
        .attr("x", ([a, b]) => x(a.date))
        .attr("height", height)
        .attr("width", ([a, b]) => x(b.date) - x(a.date))
        .on("mouseover", (event, [a]) => console.log(a))
        .on("mouseout", () => console.log("next"));


    const gx = svg.append("g")
        .call(xAxis, x);

    svg.append("g")
        .call(yAxis, y);

    svg.call(d3.zoom()
        .extent([[margin.left, 0], [width - margin.right, height]])
        .translateExtent([[margin.left, -Infinity], [width - margin.right, Infinity]])
        .scaleExtent([1, 32])
        .on("zoom", zoomed));

    function zoomed({transform}) {
    g.attr("transform", transform);
    const xz = transform.rescaleX(x); //"the current zoom transform"
    gx.call(xAxis, xz);
}

return svg.node();
}


chart();

