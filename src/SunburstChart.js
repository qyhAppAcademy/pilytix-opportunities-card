import React, { useRef, useEffect } from "react";

import * as d3 from "d3";

import Typography from "@mui/material/Typography";
import useMediaQuery from "@mui/material/useMediaQuery";

import "./SunburstChart.css";

const toSunburstChartData = (factors, name) => {
  const data = {
    name: name,
    totalValue: 0,
    children: []
  };
  if (!factors) {
    return data;
  }
  for (let factor of factors) {
    let weight = factor.weight;
    let weightGroup = data.children.find(
      (child) => child.name === weight.description
    );
    if (!weightGroup) {
      weightGroup = {
        name: weight.description,
        children: []
      };
      data.children.push(weightGroup);
    }
    weightGroup.children.push({
      name: factor.name,
      value: Math.abs(weight.value),
      message: factor.message
    });
    data.totalValue += Math.abs(weight.value);
  }
  data.children.sort((a, b) => {
    const weights = {
      "Strong Negative": -3,
      "Medium Negative": -2,
      "Weak Negative": -1,
      "Weak Positive": 1,
      "Medium Positive": 2,
      "Strong Positive": 3
    };
    return Math.abs(weights[b.name]) - Math.abs(weights[a.name]);
  });
  return data;
};

const minWidth = 450;

const width = 600;

const radius = width / 6;

const arc = d3
  .arc()
  .startAngle((d) => d.x0)
  .endAngle((d) => d.x1)
  .padAngle((d) => Math.min((d.x1 - d.x0) / 2, 0.005))
  .padRadius(radius * 1.5)
  .innerRadius((d) => d.y0 * radius)
  .outerRadius((d) => Math.max(d.y0 * radius, d.y1 * radius - 1));

const SunburstChart = ({ row }) => {
  const pilytixFactorsIncreasingWin = toSunburstChartData(
    row.pilytixFactorsIncreasingWin,
    "Increasing Win"
  );

  const pilytixFactorsDecreasingWin = toSunburstChartData(
    row.pilytixFactorsDecreasingWin,
    "Decreasing Win"
  );

  const data = {
    name: "Pilytix Factors",
    children: [pilytixFactorsIncreasingWin, pilytixFactorsDecreasingWin]
  };

  const svgRef = useRef(null);

  const partition = (data) => {
    const root = d3
      .hierarchy(data)
      .sum((d) => d.value)
      .sort((a, b) => b.value - a.value);
    return d3.partition().size([2 * Math.PI, root.height + 1])(root);
  };

  const color = d3.scaleOrdinal(
    d3.quantize(d3.interpolateRainbow, data.children.length + 1)
  );

  // const format = d3.format(",d");

  useEffect(() => {
    const root = partition(data);

    root.each((d) => (d.current = d));

    const svg = d3.select(svgRef.current);

    // clear all previous content on refresh
    svg.selectAll("*").remove();

    svg
      .attr("viewBox", [0, 0, width, width])
      .style("font", "12px sans-serif")
      .style("overflow", "visible");

    // create a tooltip
    const tooltip = d3.select(".sunburst-chart-tooltip");

    // Three function that change the tooltip when user hover / move / leave a cell
    const mouseover = function (d) {
      tooltip.style("opacity", 1);
      d3.select(this).style("stroke", "yellow").style("opacity", 0.8);
    };

    const mousemove = function (event, d) {
      const x =
        event.offsetX -
        Math.floor(tooltip.node().getBoundingClientRect().width / 2.0);
      const realTimeWidth = document
        .querySelector("#sunburst-chart")
        .getBoundingClientRect().width;
      const y = -realTimeWidth + event.offsetY + 30;
      const htmlContent = d.data.message
        ? `${d.data.message}`
        : `${d.data.name} ${d.data.children ? "Factors" : ""}`;
      tooltip
        .html(htmlContent)
        .style("left", x + "px")
        .style("top", y + "px");
    };

    const mouseleave = function (d) {
      tooltip.style("opacity", 0);
      d3.select(this).style("stroke", "none").style("opacity", 1);
    };

    const g = svg
      .append("g")
      .attr("transform", `translate(${width / 2},${width / 2})`);

    const path = g
      .append("g")
      .selectAll("path")
      .data(root.descendants().slice(1))
      .join("path")
      .attr("fill", (d) => {
        while (d.depth > 1) d = d.parent;
        return color(d.data.name);
      })
      .attr("fill-opacity", (d) =>
        arcVisible(d.current) ? (d.children ? 0.6 : 0.4) : 0
      )
      .attr("pointer-events", (d) => (arcVisible(d.current) ? "auto" : "none"))
      .attr("d", (d) => arc(d.current))
      .on("mouseover", mouseover)
      .on("mousemove", mousemove)
      .on("mouseleave", mouseleave);

    path
      .filter((d) => d.children)
      .style("cursor", "pointer")
      .on("click", clicked);

    // path.append("title").text(
    //   (d) =>
    //     `${d
    //       .ancestors()
    //       .map((d) => d.data.name)
    //       .reverse()
    //       .join("/")}\n${format(d.value)}`
    // );

    const label = g
      .append("g")
      .attr("pointer-events", "none")
      .attr("text-anchor", "middle")
      .style("user-select", "none")
      .selectAll("text")
      .data(root.descendants().slice(1))
      .join("text")
      .attr("dy", "0.35em")
      .attr("fill-opacity", (d) => +labelVisible(d.current))
      .attr("transform", (d) => labelTransform(d.current))
      .text((d) => d.data.name);

    const parent = g
      .append("circle")
      .datum(root)
      .attr("r", radius)
      .attr("fill", "none")
      .attr("pointer-events", "all")
      .on("click", clicked);

    function clicked(event, p) {
      parent.datum(p.parent || root);

      root.each(
        (d) =>
          (d.target = {
            x0:
              Math.max(0, Math.min(1, (d.x0 - p.x0) / (p.x1 - p.x0))) *
              2 *
              Math.PI,
            x1:
              Math.max(0, Math.min(1, (d.x1 - p.x0) / (p.x1 - p.x0))) *
              2 *
              Math.PI,
            y0: Math.max(0, d.y0 - p.depth),
            y1: Math.max(0, d.y1 - p.depth)
          })
      );

      const t = g.transition().duration(750);

      // Transition the data on all arcs, even the ones that aren’t visible,
      // so that if this transition is interrupted, entering arcs will start
      // the next transition from the desired position.
      path
        .transition(t)
        .tween("data", (d) => {
          const i = d3.interpolate(d.current, d.target);
          return (t) => (d.current = i(t));
        })
        .filter(function (d) {
          return +this.getAttribute("fill-opacity") || arcVisible(d.target);
        })
        .attr("fill-opacity", (d) =>
          arcVisible(d.target) ? (d.children ? 0.6 : 0.4) : 0
        )
        .attr("pointer-events", (d) => (arcVisible(d.target) ? "auto" : "none"))

        .attrTween("d", (d) => () => arc(d.current));

      label
        .filter(function (d) {
          return +this.getAttribute("fill-opacity") || labelVisible(d.target);
        })
        .transition(t)
        .attr("fill-opacity", (d) => +labelVisible(d.target))
        .attrTween("transform", (d) => () => labelTransform(d.current));
    }

    function arcVisible(d) {
      return d.y1 <= 3 && d.y0 >= 1 && d.x1 > d.x0;
    }

    function labelVisible(d) {
      return d.y1 <= 3 && d.y0 >= 1 && (d.y1 - d.y0) * (d.x1 - d.x0) > 0.03;
    }

    function labelTransform(d) {
      const x = (((d.x0 + d.x1) / 2) * 180) / Math.PI;
      const y = ((d.y0 + d.y1) / 2) * radius;
      return `rotate(${x - 90}) translate(${y},0) rotate(${x < 180 ? 0 : 180})`;
    }
  }, [data]);

  const matches = useMediaQuery(`(min-width:${minWidth}px)`);

  return (
    <>
      <Typography variant="h5" sx={{ margin: "20px 0 20px 0" }}>
        Pilytix Factors
      </Typography>
      {matches ? (
        <div className="sunburst-chart" id="sunburst-chart">
          <svg
            width={width}
            height={width}
            ref={svgRef}
            style={{ width: "100%", height: "auto" }}
          />
          <div className="sunburst-chart-tooltip">Placeholder</div>
        </div>
      ) : (
        <Typography variant="h6">
          {`Better Viewing at Minimum Screen Size ${minWidth}px`}
        </Typography>
      )}
    </>
  );
};

export default SunburstChart;
