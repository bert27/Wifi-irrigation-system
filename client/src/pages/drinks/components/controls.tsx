import { Box, Card, IconButton } from "@mui/material";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import StarsIcon from "@mui/icons-material/Stars";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import {
  drinksService,
} from "@/pages/drinks/services/drinks.service";

export const Controls = () => {
  const sendCommand = async (direction: string) => {
    try {
      await drinksService.sendControlCommand(direction);
    } catch (e) {
      console.error("Error sending command", e);
    }
  };

  const moveBack = () => sendCommand("back");
  const moveUp = () => sendCommand("up");
  const moveNext = () => sendCommand("next");
  const moveDown = () => sendCommand("down");
  const accept = () => sendCommand("accept");
  return (
    <Card variant="outlined">
      <div style={{ justifyContent: "center", display: "flex" }}>
        <IconButton aria-label="KeyboardArrowUpIcon" onClick={() => moveUp()}>
          <KeyboardArrowUpIcon />
        </IconButton>
      </div>

      <div>
        <IconButton aria-label="ArrowForwardIosIcon" onClick={() => moveBack()}>
          <ArrowBackIosIcon />
        </IconButton>
        <IconButton aria-label="StarsIcon" onClick={() => accept()}>
          <StarsIcon />
        </IconButton>
        <IconButton aria-label="ArrowForwardIosIcon" onClick={() => moveNext()}>
          <ArrowForwardIosIcon />
        </IconButton>
      </div>
      <div style={{ justifyContent: "center", display: "flex" }}>
        <IconButton
          aria-label="KeyboardArrowDownIcon"
          onClick={() => moveDown()}
        >
          <KeyboardArrowDownIcon />
        </IconButton>
      </div>
    </Card>
  );
};
