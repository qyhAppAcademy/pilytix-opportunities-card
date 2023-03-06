import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import useMediaQuery from "@mui/material/useMediaQuery";

import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

const minWidth = 450;

const ProbabilityWatch = ({ row }) => {
  const matches = useMediaQuery(`(min-width:${minWidth}px)`);

  const probs = [row.pilytixProbability, row.repProbability];

  return (
    <>
      {probs.map((prob, idx) => (
        <Box
          sx={{
            display: "inline-flex",
            flexDirection: "column",
            alignItems: "center",
            width: matches ? "20%" : "50%",
            minWidth: matches ? "" : "100px",
            paddingLeft: "5%",
            paddingRight: "5%",
            paddingTop: "10px"
          }}
          key={idx}
        >
          <CircularProgressbar
            value={Math.round(prob * 100)}
            text={`${Math.round(prob * 100)}%`}
            styles={buildStyles({
              // This is in units relative to the 100x100px
              // SVG viewbox.
              textSize: "150%",
              textColor: "black",
              pathColor: idx === 0 ? "#4ee4bb" : "#74AEFA",
              trailColor: "#dcdcdc"
            })}
          />
          <Typography
            sx={{ textAlign: "center", marginTop: "10px" }}
            variant="h6"
          >
            {idx === 0 ? "Pilytix Prob." : "Rep Prob."}
          </Typography>
        </Box>
      ))}
    </>
  );
};

export default ProbabilityWatch;
