export function bubbleGraph(val, d3) {
    const larger = Math.floor(Math.random() * 91)+10;
    const smaller = larger * val / 100;
    const data = [
        { name: ".", value: smaller},
        { name: ".", value: larger},
        { name: " ", value: Math.floor(Math.random() * 101)},
        { name: " ", value: Math.floor(Math.random() * 101)},
        { name: " ", value: Math.floor(Math.random() * 101)}
    ];

    const width = 500;
    const height = width;
    const margin = 1;

    const pack = d3.pack()
        .size([width - margin * 2, height - margin * 2])
        .padding(3);

    const root = pack(
        d3.hierarchy({ children: data })
            .sum(d => d.value)
    );

    const svg = d3.create("svg")
        .attr("width", width)
        .attr("height", height);

    const node = svg.append("g")
        .selectAll()
        .data(root.leaves())
        .join("g")
        .attr("transform", d => `translate(${d.x},${d.y})`);

    node.append("circle")
        .attr("fill", "none")
        .attr("stroke", "black")
        .attr("stroke-width", 3)
        .attr("r", d => d.r);

    node.append("text")
        .attr("text-anchor", "middle")
        .attr("font-size", 48)
        .text(d => d.data.name);

    return svg.node();
}

export function stackedBarGraph(val, d3) {
    const larger = Math.floor(Math.random() * 81)+20;
    const smaller = larger * val / 100;
    const data = [
        { name: " ", value: Math.floor(Math.random() * 91)+10},
        { name: ".", value: smaller},
        { name: ".", value: larger},
        { name: " ", value: Math.floor(Math.random() * 91)+10},
        { name: " ", value: Math.floor(Math.random() * 91)+10}
    ];

    for (let i = data.length - 1; i > 0; i--) {
        const randomIndex = Math.floor(Math.random() * (i + 1));
        [data[i], data[randomIndex]] = [data[randomIndex], data[i]];
    }

    const width = 200;
    const height = 500;
    const margin = { top: 20, right: 20, bottom: 20, left: 40 };
    const barWidth = 120;
    const barX = (width - barWidth) / 2;
    const barHeight = height - margin.top - margin.bottom;
    const total = d3.sum(data, d => d.value);
    let nextY = height - margin.bottom;

    const svg = d3.create("svg")
        .attr("width", width)
        .attr("height", height);

    const positionedData = data.map(segment => {
        const segmentHeight = (segment.value / total) * barHeight;
        nextY -= segmentHeight;

        return {
            name: segment.name,
            y: nextY,
            height: segmentHeight
        };
    });

    const segments = svg.append("g")
        .selectAll("g")
        .data(positionedData)
        .join("g")
        .attr("transform", d => `translate(${barX},${d.y})`);

    segments.append("rect")
        .attr("width", barWidth)
        .attr("height", d => d.height)
        .attr("fill", "white")
        .attr("stroke", "black")
        .attr("stroke-width", 2);

    segments.append("text")
        .attr("x", barWidth / 2)
        .attr("y", d => d.height / 2)
        .attr("text-anchor", "middle")
        .attr("font-size", 30)
        .text(d => d.name);

    const scale = d3.scaleLinear()
        .domain([0, 100])
        .range([height - margin.bottom, margin.top]);
    
    svg.append("g")
        .attr("transform", `translate(${barX},0)`)
        .call(d3.axisLeft(scale).tickValues([0,25,50,75,100]));

    return svg.node();
}

export function radarGraph(val, d3){
    const randomValues = () => [
        rando(),
        rando(),
        rando(),
        rando(),
        rando()
    ];
    const areaRatio = val / 100;
    const originalXValues = randomValues();
    const yValues = areaRatio === 0
        ? [0, 0, 0, 0, 0]
        : randomValues();

    const polygonArea = values => {
        const points = values.map((value, index) => {
            const angle = (index * 2 * Math.PI) / values.length - Math.PI / 2;
            return {
                x: value * Math.cos(angle),
                y: value * Math.sin(angle)
            };
        });

        const twiceArea = points.reduce((sum, point, index) => {
            const nextPoint = points[(index + 1) % points.length];
            return sum + point.x * nextPoint.y - nextPoint.x * point.y;
        }, 0);

        return Math.abs(twiceArea) / 2;
    };

    let xScale = 1;
    if (areaRatio > 0) {
        const targetXArea = polygonArea(yValues) / areaRatio;
        const currentXArea = polygonArea(originalXValues);
        xScale = Math.sqrt(targetXArea / currentXArea);
    }

    const xValues = originalXValues.map(value => value * xScale);
    const largestValue = Math.max(...xValues, ...yValues);
    const fitScale = largestValue > 100 ? 100 / largestValue : 1;
    const scaledXValues = xValues.map(value => value * fitScale);
    const scaledYValues = yValues.map(value => value * fitScale);
    const charts = [
        { title: " ", values: randomValues() },
        { title: " ", values: randomValues() },
        { title: " ", values: randomValues() },
        { title: ".", values: scaledXValues },
        { title: ".", values: scaledYValues }
    ];

    for (let index = charts.length - 1; index > 0; index--) {
        const randomIndex = Math.floor(Math.random() * (index + 1));
        [charts[index], charts[randomIndex]] = [charts[randomIndex], charts[index]];
    }

    const chartSize = 300;
    const columns = 3;
    const rows = Math.ceil(charts.length / columns);
    const width = columns * chartSize;
    const height = rows * chartSize;
    const svg = d3.create("svg")
        .attr("width", width)
        .attr("height", height)
        .attr("viewBox", `0 0 ${width} ${height}`);

    const shapeCenter = values => {
        const points = values.map((value, index) => {
            const angle = (index * 2 * Math.PI) / values.length - Math.PI / 2;
            return {
                x: value * Math.cos(angle),
                y: value * Math.sin(angle)
            };
        });

        const sums = points.reduce((result, point, index) => {
            const nextPoint = points[(index + 1) % points.length];
            const cross = point.x * nextPoint.y - nextPoint.x * point.y;
            result.area += cross;
            result.x += (point.x + nextPoint.x) * cross;
            result.y += (point.y + nextPoint.y) * cross;
            return result;
        }, { area: 0, x: 0, y: 0 });

        return {
            x: sums.x / (3 * sums.area),
            y: sums.y / (3 * sums.area)
        };
    };

    charts.forEach((chartData, index) => {
        const column = index % columns;
        const row = Math.floor(index / columns);
        const chartSvg = makeRadarGraph(
            chartData.values[0],
            chartData.values[1],
            chartData.values[2],
            chartData.values[3],
            chartData.values[4],
            d3
        );
        const center = shapeCenter(chartData.values);
        d3.select(chartSvg)
            .select("g")
            .append("text")
            .attr("x", center.x)
            .attr("y", center.y)
            .attr("dominant-baseline", "middle")
            .attr("font-size", 48)
            .text(chartData.title);
        
        chartSvg.setAttribute("x", column * chartSize);
        chartSvg.setAttribute("y", row * chartSize);
        svg.node().append(chartSvg);
    });

    return svg.node();
}

function rando(){
    return Math.floor(Math.random() * 91)+10
}

function makeRadarGraph(v1, v2, v3, v4, v5, d3) {
    const values = [
        { axis: "1", value: v1 },
        { axis: "2", value: v2 },
        { axis: "3", value: v3 },
        { axis: "4", value: v4 },
        { axis: "5", value: v5 }
    ];

    const size = 300;
    const center = size / 2;
    const radius = 100;
    const axisPoints = [25, 50, 75, 100];
    const radiusScale = d3.scaleLinear()
        .domain([0, 100])
        .range([0, radius]);

    const angle = index =>
        (index * 2 * Math.PI) / values.length - Math.PI / 2;
    const point = (value, index) => ({
        x: radiusScale(value) * Math.cos(angle(index)),
        y: radiusScale(value) * Math.sin(angle(index))
    });
    const points = values.map((item, index) => point(item.value, index));
    const radarLine = d3.line()
        .x(item => item.x)
        .y(item => item.y)
        .curve(d3.curveLinearClosed);

    const svg = d3.create("svg")
        .attr("width", size)
        .attr("height", size);
    
    const chart = svg.append("g")
        .attr("transform", `translate(${center},${center})`);

    // make grid
    chart.selectAll("circle.grid")
        .data(axisPoints)
        .join("circle")
        .attr("class", "grid")
        .attr("r", value => radiusScale(value))
        .attr("fill", "none")
        .attr("stroke", "gray");

    chart.selectAll("line.axis")
        .data(values)
        .join("line")
        .attr("class", "axis")
        .attr("x2", (item, index) => radius * Math.cos(angle(index)))
        .attr("y2", (item, index) => radius * Math.sin(angle(index)))
        .attr("stroke", "gray");

    //add points and connect them
    chart.append("path")
        .datum(points)
        .attr("d", radarLine)
        .attr("fill", "none")
        .attr("stroke", "black")
        .attr("stroke-width", 2);

    chart.selectAll("circle.value")
        .data(points)
        .join("circle")
        .attr("class", "value")
        .attr("cx", item => item.x)
        .attr("cy", item => item.y)
        .attr("r", 4)
        .attr("fill", "black");

    return svg.node();
}