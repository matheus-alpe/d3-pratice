import * as d3 from "d3";

interface Option {
  name: string;
  value: number;
}

function render(data: Array<Option>) {
  const margin = { top: 20, right: 20, bottom: 40, left: 50 };
  const width = 600 - margin.left - margin.right;
  const height = 300 - margin.top - margin.bottom;

  const svg = d3
    .select("#app")
    .append("svg")
    .attr(
      "viewBox",
      `0 0 ${width + margin.left + margin.right} ${height + margin.top + margin.bottom}`,
    )
    .style("border", "1px solid blue")
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

  const x = d3
    .scaleBand()
    .domain(data.map((d) => d.name))
    .range([0, width])
    .padding(0.2);

  const y = d3
    .scaleLinear()
    .domain([0, d3.max(data, (d) => d.value) ?? 0])
    .nice()
    .range([height, 0]);

  svg
    .append("g")
    .call((g) =>
      g.attr("transform", `translate(0, ${height})`).call(d3.axisBottom(x)),
    );

  svg
    .append("g")
    .call((g) =>
      g
        .call(d3.axisLeft(y).ticks(5))
        .call((internalG) => internalG.select(".domain").remove()),
    );

  const tooltip = d3
    .select("body")
    .append("div")
    .style("position", "absolute")
    .style("background", "#333")
    .style("color", "#fff")
    .style("padding", "8px")
    .style("border-radius", "4px")
    .style("font-size", "12px")
    .style("pointer-events", "none")
    .style("opacity", 0);

  svg
    .selectAll<SVGRectElement, Option>(".bar")
    .data(data, (d) => d.name)
    .join(
      (enter) =>
        enter
          .append("rect")
          .attr("class", "bar")
          .attr("x", (d) => x(d.name) ?? null)
          .attr("width", x.bandwidth())
          .attr("y", height)
          .attr("height", 0)
          .attr("fill", "steelblue")
          .call((innerEnter) =>
            innerEnter
              .transition()
              .duration(600)
              .attr("y", (d) => y(d.value))
              .attr("height", (d) => height - y(d.value)),
          ),
      (update) =>
        update.call((innerUpdate) =>
          innerUpdate
            .transition()
            .duration(600)
            .attr("x", (d) => x(d.name) ?? null)
            .attr("width", x.bandwidth())
            .attr("y", (d) => y(d.value))
            .attr("height", (d) => height - y(d.value)),
        ),
      (exit) =>
        exit.call((innerExit) =>
          innerExit
            .transition()
            .duration(400)
            .attr("y", height)
            .attr("height", 0)
            .remove(),
        ),
    )
    .on("mousemove", (event, d) => {
      tooltip
        .style("opacity", 1)
        .html(`${d.name}: ${d.value}`)
        .style("left", `${event.pageX + 10}px`)
        .style("top", `${event.pageY - 20}px`);
    })
    .on("mouseleave", () => tooltip.style("opacity", 0));

  svg
    .selectAll(".label")
    .data(data)
    .join("text")
    .attr("class", "label")
    .attr("x", (d) => (x(d.name) || 0) + x.bandwidth() / 2) // center horizontally
    .attr("y", (d) => y(d.value) - 5) // above the bar
    .attr("text-anchor", "middle") // align text center
    .text((d) => d.value);

  return {
    chart: svg,
    tooltip,
  };
}

render([
  { name: "A", value: 30 },
  { name: "B", value: 80 },
  { name: "C", value: 45 },
  { name: "D", value: 60 },
]);
