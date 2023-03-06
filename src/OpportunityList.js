import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";

import AssessmentIcon from "@mui/icons-material/Assessment";
import SellIcon from "@mui/icons-material/Sell";
import InventoryIcon from "@mui/icons-material/Inventory";
import SupportAgentIcon from "@mui/icons-material/SupportAgent";

import Typography from "@mui/material/Typography";
import Rating from "@mui/material/Rating";
import useMediaQuery from "@mui/material/useMediaQuery";

const iconColor = "#dcdcdc";
const iconSize = "2rem";
const icons = [
  <AssessmentIcon sx={{ color: iconColor, fontSize: iconSize }} />,
  <SellIcon sx={{ color: iconColor, fontSize: iconSize }} />,
  <InventoryIcon sx={{ color: iconColor, fontSize: iconSize }} />,
  <SupportAgentIcon sx={{ color: iconColor, fontSize: iconSize }} />
];

const minWidth = 600;

const OpportunityList = ({ row }) => {
  const matches = useMediaQuery(`(min-width:${minWidth}px)`);

  const items = [
    parseInt(row.pilytixTier[0], 10),
    "$" + row.amount,
    row.product,
    row.salesRepName
  ];

  return (
    <List
      sx={{
        width: matches ? "35%" : "100%",
        padding: 0
      }}
    >
      {items.map((item, idx) => (
        <ListItem key={idx} disablePadding>
          <ListItemButton sx={{ cursor: "not-allowed" }}>
            <ListItemIcon>{icons[idx]}</ListItemIcon>
            {idx === 0 ? (
              <Rating
                sx={{ left: "-4px", fontSize: "1.7rem" }}
                name="read-only"
                value={item}
                readOnly
              />
            ) : (
              <Typography variant="h6">{item}</Typography>
            )}
          </ListItemButton>
        </ListItem>
      ))}
    </List>
  );
};

export default OpportunityList;
