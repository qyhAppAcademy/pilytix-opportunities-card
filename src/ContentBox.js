import * as React from "react";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

import OpportunityList from "./OpportunityList";
import ProbabilityWatch from "./ProbabilityWatch";
import StageBar from "./StageBar";

const ContentBox = ({ row }) => {
  return (
    <Box sx={{ width: "100%" }}>
      <Typography variant="h4" sx={{ textAlign: "center" }}>
        {row.oppName}
      </Typography>

      <Typography variant="h5" sx={{ margin: "20px 0 10px 0" }}>
        Summary
      </Typography>
      <Box
        sx={{
          width: "100%",
          display: "flex",
          flexDirection: "row",
          flexWrap: "wrap",
          justifyContent: "space-evenly",
          alignItems: "flex-start"
        }}
      >
        <OpportunityList row={row} />
        <ProbabilityWatch row={row} />
      </Box>

      <StageBar stage={parseInt(row.stage[0], 10) - 1} />
    </Box>
  );
};

export default ContentBox;
