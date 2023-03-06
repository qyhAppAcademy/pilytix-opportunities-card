import React, { useState } from "react";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from "chart.js";
import { Bar } from "react-chartjs-2";
import { Line } from "react-chartjs-2";
import zoomPlugin from "chartjs-plugin-zoom";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import useMediaQuery from "@mui/material/useMediaQuery";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  zoomPlugin
);

const minWidth = 450;

const pilytixBorderColor = "rgba(78,228,187)";
const pilytixBackgroundColor = "rgba(78,228,187,0.5)";
const repBorderColor = "rgba(116,174,250)";
const repBackgroundColor = "rgba(116,174,250,0.5)";

const GridChart = ({ row }) => {
  const probabilityHistory = row.probabilityHistory;
  const pilytixProb = row.pilytixProbability;
  const repProb = row.repProbability;

  const labels = probabilityHistory
    ? probabilityHistory.map((prob) => prob.daysAgo + "")
    : [];
  labels.push("Latest");

  const pilytixProbs = probabilityHistory
    ? probabilityHistory.map((prob) => prob.pilytixProb * 100)
    : [];
  pilytixProbs.push(pilytixProb * 100);

  const repProbs = probabilityHistory
    ? probabilityHistory.map((prob) => prob.repProb * 100)
    : [];
  repProbs.push(repProb * 100);

  const options = {
    responsive: true,
    scales: {
      x: {
        title: {
          display: true,
          text: "Days Ago"
        }
      },
      y: {
        title: {
          display: true,
          text: "%"
        },
        min: 0,
        max: 100
      }
    },
    plugins: {
      legend: {
        position: "top" as const
      },
      tooltip: {
        callbacks: {
          title: function (context) {
            return context[0].label !== "Latest"
              ? `${context[0].label} days ago`
              : context[0].label;
          },
          label: function (context) {
            return `${context.dataset.label} ${context.formattedValue}%`;
          }
        }
      },
      zoom: {
        limits: {
          x: { minRange: 0 }
        },
        pan: {
          enabled: true,
          mode: "x"
        },
        zoom: {
          wheel: {
            enabled: false,
            speed: 0.01
          },
          pinch: {
            enabled: false
          },
          mode: "x"
        }
      }
    },
    onClick(e) {
      const chart = e.chart;
      chart.options.plugins.zoom.zoom.wheel.enabled = !chart.options.plugins
        .zoom.zoom.wheel.enabled;
      chart.options.plugins.zoom.zoom.pinch.enabled = !chart.options.plugins
        .zoom.zoom.pinch.enabled;
      chart.update();
    }
  };

  const data = {
    labels,
    datasets: [
      {
        label: "Pilytix Prob.",
        data: pilytixProbs,
        borderColor: pilytixBorderColor,
        backgroundColor: pilytixBackgroundColor
      },
      {
        label: "Rep Prob.",
        data: repProbs,
        borderColor: repBorderColor,
        backgroundColor: repBackgroundColor
      }
    ]
  };

  const borderPlugin = {
    id: "chartAreaBorder",
    beforeDraw(chart, args, options) {
      const {
        ctx,
        chartArea: { left, top, width, height }
      } = chart;
      if (chart.options.plugins.zoom.zoom.wheel.enabled) {
        ctx.save();
        ctx.strokeStyle = "yellow";
        ctx.lineWidth = 1;
        ctx.strokeRect(left, top, width, height);
        ctx.restore();
      }
    }
  };

  const [alignment, setAlignment] = useState("barChart");

  const handleChange = (event, newAlignment) => {
    setAlignment(newAlignment);
  };

  const matches = useMediaQuery(`(min-width:${minWidth}px)`);

  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          flexWrap: "wrap",
          justifyContent: "space-between",
          alignItems: "center",
          width: "100%",
          margin: "20px 0 20px 0"
        }}
      >
        <Typography variant="h5">Probability</Typography>
        {matches && (
          <ToggleButtonGroup
            color="primary"
            value={alignment}
            exclusive
            onChange={handleChange}
            aria-label="Platform"
            sx={{
              float: "right",
              margin: matches ? 0 : "20px 0 0 0",
              minWidth: matches ? "" : "100%"
            }}
          >
            <ToggleButton value="barChart">Bar Chart</ToggleButton>
            <ToggleButton value="lineChart">Line Chart</ToggleButton>
          </ToggleButtonGroup>
        )}
      </Box>
      {matches ? (
        alignment === "barChart" ? (
          <Bar options={options} data={data} plugins={[borderPlugin]} />
        ) : (
          <Line options={options} data={data} plugins={[borderPlugin]} />
        )
      ) : (
        <Typography variant="h6">
          {`Better Viewing at Minimum Screen Size ${minWidth}px`}
        </Typography>
      )}
    </Box>
  );
};

export default GridChart;
