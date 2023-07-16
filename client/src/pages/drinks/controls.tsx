import { Box, Card, IconButton } from "@mui/material";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import StarsIcon from "@mui/icons-material/Stars";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import {
  PostControlCocktailMachineInterface,
  controlService,
} from "../../services/Controller-machine.service";
export const Controls = (props: any) => {
  const postSendInfo = async (data: PostControlCocktailMachineInterface) => {
    const response = await controlService.postControlCocktailMachine(data);
    console.log("response",response)
  };

  const moveBack = () => {
    postSendInfo({ direction: "back" });
  };

  const moveUp = () => {
    postSendInfo({ direction: "up" });
  };

  const moveNext = () => {
    postSendInfo({ direction: "next" });
  };

  const moveDown = () => {
    postSendInfo({ direction: "down" });
  };

  const accept = () => {
    postSendInfo({ direction: "accept" });
  };
  return (
    <Card variant="outlined">
      <Box sx={{ justifyContent: "center", display: "flex" }}>
        <IconButton aria-label="KeyboardArrowUpIcon" onClick={() => moveUp()}>
          <KeyboardArrowUpIcon />
        </IconButton>
      </Box>

      <Box>
        <IconButton aria-label="ArrowForwardIosIcon" onClick={() => moveBack()}>
          <ArrowBackIosIcon />
        </IconButton>
        <IconButton aria-label="StarsIcon" onClick={() => accept()}>
          <StarsIcon />
        </IconButton>
        <IconButton aria-label="ArrowForwardIosIcon" onClick={() => moveNext()}>
          <ArrowForwardIosIcon />
        </IconButton>
      </Box>
      <Box sx={{ justifyContent: "center", display: "flex" }}>
        <IconButton
          aria-label="KeyboardArrowDownIcon"
          onClick={() => moveDown()}
        >
          <KeyboardArrowDownIcon />
        </IconButton>
      </Box>
    </Card>
  );
};
