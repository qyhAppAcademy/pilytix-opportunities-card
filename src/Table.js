import * as React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";

import Dialog from "@mui/material/Dialog";
import BasicCard from "./Card";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";

import * as opportunities from "./opportunities.json";

export default function BasicTable() {
  /**
   * A basic table to display all non-nested information from opportunities.json
   */
  const data = opportunities.default;

  const [open, setOpen] = React.useState(false);
  const [clickedRow, setClickedRow] = React.useState(undefined);

  React.useEffect(() => {
    const handleKeyPress = (event) => {
      if (event.key === "ArrowLeft") {
        setClickedRow(clickedRow === 0 ? data.length - 1 : clickedRow - 1);
      } else if (event.key === "ArrowRight") {
        setClickedRow(clickedRow + 1 === data.length ? 0 : clickedRow + 1);
      }
    };

    // initiate the event handler
    window.addEventListener("keydown", handleKeyPress);

    // this will clean up the event every time the component is re-rendered
    return function cleanup() {
      window.removeEventListener("keydown", handleKeyPress);
    };
  });

  const handleRowClick = (event, row) => {
    setClickedRow(row);
    setOpen(true);
  };

  const handleBackClick = (event) => {
    setClickedRow(clickedRow === 0 ? data.length - 1 : clickedRow - 1);
    setOpen(true);
  };

  const handleForwardClick = (event) => {
    setClickedRow(clickedRow + 1 === data.length ? 0 : clickedRow + 1);
  };

  const handleClose = () => {
    setClickedRow(undefined);
    setOpen(false);
  };

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell align="left">Opp Name</TableCell>
            <TableCell align="left">Opp Stage</TableCell>
            <TableCell align="right">Rep Probability</TableCell>
            <TableCell align="right">PX Probability</TableCell>
            <TableCell align="left">PX Tier</TableCell>
            <TableCell align="right">Amount</TableCell>
            <TableCell align="left">Product</TableCell>
            <TableCell align="left">Sales Rep</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((row, idx) => (
            <TableRow
              onClick={(event) => handleRowClick(event, idx)}
              key={row.oppId}
              sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
            >
              <TableCell component="th" scope="row">
                {row.oppName}
              </TableCell>
              <TableCell align="left">{row.stage}</TableCell>
              <TableCell align="right">{row.repProbability}</TableCell>
              <TableCell align="right">{row.pilytixProbability}</TableCell>
              <TableCell align="left">{row.pilytixTier}</TableCell>
              <TableCell align="right">{row.amount}</TableCell>
              <TableCell align="left">{row.product}</TableCell>
              <TableCell align="left">{row.salesRepName}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Dialog
        sx={{
          "& .MuiDialog-container": {
            "& .MuiPaper-root": {
              width: "100%",
              maxWidth: "750px" // Set your width here
            }
          }
        }}
        onClose={handleClose}
        open={open}
      >
        {clickedRow !== undefined && (
          <>
            <ArrowBackIosIcon
              style={{
                position: "fixed",
                top: "50%",
                left: "3px",
                color: "white"
              }}
              onClick={handleBackClick}
            />
            <ArrowForwardIosIcon
              style={{
                position: "fixed",
                top: "50%",
                right: "3px",
                color: "white"
              }}
              onClick={handleForwardClick}
            />
            <BasicCard row={data[clickedRow]}></BasicCard>
          </>
        )}
      </Dialog>
    </TableContainer>
  );
}
