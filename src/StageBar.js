import * as React from "react";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import useMediaQuery from "@mui/material/useMediaQuery";

import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";

const completedColor = "#4ee4bb";
const activeColor = "#74aefa";

const stages = [
  "No Conversation",
  "Attempted Contact",
  "Initial Conversation",
  "Fourth Stage",
  "Meeting or Product Discovery",
  "Sixth Stage",
  "Nearing a Decision",
  "Payment Pending",
  "Ninth Stage"
];

const minWidth = 350;

const StageBar = ({ stage }) => {
  const matches = useMediaQuery(`(min-width:${minWidth}px)`);

  return (
    <>
      <Typography variant="h5" sx={{ margin: "20px 0 20px 0" }}>
        Stage -{" "}
        {matches
          ? stages[stage]
          : stages[stage]
              .split(" ")
              .map((word) => word[0])
              .join(". ")}
      </Typography>
      <Box sx={{ width: "100%" }}>
        <Stepper
          activeStep={stage}
          alternativeLabel
          sx={{
            "& .MuiStep-root": {
              padding: matches ? "0 3px 0 3px" : "0"
            }
          }}
        >
          {stages.map((stage, idx) => (
            <Step
              key={idx}
              sx={{
                "& .MuiStepLabel-root .Mui-completed": {
                  color: completedColor
                },
                "& .MuiStepLabel-root .Mui-active": {
                  color: activeColor
                }
              }}
            >
              <StepLabel></StepLabel>
            </Step>
          ))}
        </Stepper>
      </Box>
    </>
  );
};

export default StageBar;
