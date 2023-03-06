import * as React from "react";

import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";

import {
  createTheme,
  responsiveFontSizes,
  ThemeProvider
} from "@mui/material/styles";

import ContentBox from "./ContentBox";
import GridChart from "./GridChart";
import SunburstChart from "./SunburstChart";

let theme = createTheme();
theme = responsiveFontSizes(theme);

const BasicCard = ({ row }) => {
  return (
    <ThemeProvider theme={theme}>
      <Card sx={{ overflow: "scroll" }}>
        <CardContent>
          <ContentBox row={row} />
          <GridChart row={row} />
          <SunburstChart row={row} />
        </CardContent>
      </Card>
    </ThemeProvider>
  );
};

export default BasicCard;
