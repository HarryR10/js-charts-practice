import * as d3 from "d3";
import uid from "@observablehq/stdlib/src/dom/uid"
// import DOM from "@observablehq/stdlib/src/dom"

const source = {
    apiPath: "https://www.alphavantage.co/",
    apiKey: "demo",
    apiFunc: "TIME_SERIES_INTRADAY",
    funcSymbol: "IBM",
    funcInterval: "5min",
    funcOutputSize: "full",
    fullPath() {return `${this.apiPath}query`
        +`?function=${this.apiFunc}`
        +`&symbol=${this.funcSymbol}`
        +`&interval=${this.funcInterval}`
        +`&outputsize=${this.funcOutputSize}`
        +`&apikey=${this.apiKey}`}
}

let tradeVolumes = d3.json(source.fullPath()).then(
    (queryResult) => {
    let timeSeries = new Map(Object.entries(queryResult["Time Series (5min)"]));
    for(let el of timeSeries.values()){
        // console.log(el["5. volume"])
    }
})

let margin = ({top: 20, right: 20, bottom: 30, left: 30});
let width = 600;
let height = 600;

//https://observablehq.com/@d3/zoomable-area-chart
const zoom = d3.zoom()
    //k0, k1 - минимальное и макксимально значение зума:
    .scaleExtent([1, 32])
    //задаются размеры области просмотра ->
    //здесь ограничиваем график так, чтобы не было видно пустых областей при пролистывании:
    .extent([[margin.left, 0], [width - margin.right, height]])
    //здесь кадрируем область с данными:
    .translateExtent([[margin.left, -Infinity], [width - margin.right, Infinity]])
    //listen for zoom events - первый параметр - это тип события. Второй - функция
    .on("zoom", zoomed);

const svg = d3.create("svg")
    .attr("viewBox", [0, 0, width, height]);

//разбирается пример с Observable, где используется объект DOM - часть библиотеки @observablehq/stdlib
//в этой функции генерируется уникальный идентификатор
//в изначальном примере:
// const clip = DOM.uid("clip");
//здесь uid экспортируется напрямую:
const clip = uid("clip");
// console.log(clip);

function zoomed(event) {
    // const xz = event.transform.rescaleX(x);
    // path.attr("d", area(data, xz));
    // gx.call(xAxis, xz);
}

svg.append("clipPath")
    .attr("id", clip.id)
    .append("rect")
    .attr("x", margin.left)
    .attr("y", margin.top)
    .attr("width", width - margin.left - margin.right)
    .attr("height", height - margin.top - margin.bottom);