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
        .attr("font-size", "48px")
        .text(d => d.data.name);

    return svg.node();
}

export function stackedBarGraph(val, d3) {
    const svg = d3.create("svg")
        .attr("width", width)
        .attr("height", height);

    return svg.node();
}

export function radarGraph(val, d3) {
    const svg = d3.create("svg")
        .attr("width", width)
        .attr("height", height);

    return svg.node();
}

