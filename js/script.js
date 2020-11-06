import * as d3 from "d3";
import uid from "@observablehq/stdlib/src/dom/uid"
// import DOM from "@observablehq/stdlib/src/dom"

// let d3 = require("d3");
// let uid = require("@observablehq/stdlib/src/dom/uid");



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

const margin = ({top: 20, right: 20, bottom: 30, left: 30});
const width = 600;
const height = 100;

const x = d3.scaleUtc()                         //шкала времени
    .domain(d3.extent(data, d => d.date))       //d3.extent - получить минимальное и максимальное значение. Внимание на 2й аргумент
    .range([margin.left, width - margin.right])

const y = d3.scaleLinear()
    .domain([0, d3.max(data, d => d.value)]).nice() //continuous.nice() для шкалы - округляет начальное и конечное значение шкалы
    .range([height - margin.bottom, margin.top])    //диапазон шкалы для указанного массива значений
                                                    //на практике растягивает отображаемые значения по шкале (понятно, если закомментить)


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

const area = (data, x) =>
    // d3.stack()
    //     .keys(["value"])
    //     .order(d3.stackOrderNone)
    //     .offset(d3.stackOffsetNone)
    //     // .map
    // (data)
    d3.area()
    .curve(d3.curveStepAfter)
    .x(d => x(d.date))
    .y0(d => y(d.downBorder))
    .y1(d => y(d.value))
    (data)


// let tradeVolumes = d3.json(source.fullPath()).then(
//     (queryResult) => {
//         let timeSeries = new Map(Object.entries(queryResult["Time Series (5min)"]));
//         for(let el of timeSeries.keys()){
//             data.push({
//                 date: el,
//                 value: timeSeries.get(el)["5. volume"],
//             });
//             // tradeVolumes.forEach((value, key, map) => ...
//         }
//     });
    // .then(()=> console.log(data));

const chart = function () {
    const zoom = d3.zoom()
        //k0, k1 - минимальное и макксимально значение зума:
        .scaleExtent([1, 32])
        //задаются размеры области просмотра ->
        //здесь ограничиваем график так, чтобы не было видно пустых областей при пролистывании:
        .extent([[margin.left, 0], [width - margin.right, height]])
        //здесь кадрируем область с данными:
        .translateExtent([[margin.left, -Infinity], [width - margin.right, Infinity]])
        //listen for zoom events - первый параметр - это тип события. Второй - функция
        //на событие увеличения повешена функция zoomed()
        .on("zoom", zoomed);

    //получает текущее событие т.е событие зума
    function zoomed(event){
        const xz = event.transform.rescaleX(x); //"the current zoom transform"
        path.attr("d", area(data, xz));
        gx.call(xAxis, xz);
    }


    const svg = d3.select("body").append("svg")
        .attr("viewBox", [0, 0, width, height]);

    // const svg = d3.select("svg")
    //     .attr("viewBox", [0, 0, width, height]);


    //разбирается пример с Observable, где используется объект DOM - часть библиотеки @observablehq/stdlib
    //в этой функции генерируется уникальный идентификатор
    //в изначальном примере:
    // const clip = DOM.uid("clip");
    //здесь uid экспортируется напрямую:
    const clip = uid("clip");
    // console.log(clip);


    //clipPath - это та область, где происходит отрисовка "фон"
    //<clipPath> - позволяет "отсекать" части svg
    //за границы, определенные здесь, svg не выйдет
    // https://developer.mozilla.org/ru/docs/Web/SVG/Element/clipPath
    svg.append("clipPath")                                  //добавляет в svg дочерний элемент, мб в виде функции
        .attr("id", clip.id)
      .append("rect")
        .attr("x", margin.left)
        .attr("y", margin.top)
        .attr("width", width - margin.left - margin.right)
        .attr("height", height - margin.top - margin.bottom)
        .attr("rx", 15)
        .attr("ry", 15)

    //отрисовка самого графика происходит в "path"
    //Элемент <path> является общим элементом для описания фигуры.
    //Все базовые фигуры могут быть созданы с помощью элемента path.
    const path = svg.append("path")
        .attr("clip-path", clip)
        .attr("fill", "orange")
        .attr("d", area(data, x));

    //Элемент <g> используется для группировки других SVG элементов
    //добавляем оси - обращаемся к соответствующим функциям
    const gx = svg.append("g")
        .call(xAxis, x);

    svg.append("g")
        .call(yAxis, y);

    //
    svg.call(zoom)
        .transition()
        .duration(750)
        .call(zoom.scaleTo, 4, [x(Date.UTC(1988, 1, 4)), 0]);

    return svg.node();
}

chart();
