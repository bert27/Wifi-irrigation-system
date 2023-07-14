import { Box, Card, IconButton } from "@mui/material";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import StarsIcon from "@mui/icons-material/Stars";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
export const Controls = (props: any) => {
  return (
    <Card variant="outlined">
      <Box sx={{ justifyContent: "center", display: "flex" }}>
        <IconButton aria-label="KeyboardArrowUpIcon">
          <KeyboardArrowUpIcon />
        </IconButton>
      </Box>

      <Box>
        <IconButton aria-label="ArrowForwardIosIcon">
          <ArrowBackIosIcon />
        </IconButton>
        <IconButton aria-label="StarsIcon">
          <StarsIcon />
        </IconButton>
        <IconButton aria-label="ArrowForwardIosIcon">
          <ArrowForwardIosIcon />
        </IconButton>
      </Box>
      <Box sx={{ justifyContent: "center", display: "flex" }}>
        <IconButton aria-label="KeyboardArrowDownIcon">
          <KeyboardArrowDownIcon />
        </IconButton>
      </Box>
    </Card>
  );
};
