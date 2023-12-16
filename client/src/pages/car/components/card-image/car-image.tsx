import { Box } from "@mui/material";

import IconRueda from "./images/rueda.png";
import ChasisCar from "./images/car.png";

import IconArrowArriba from "./images/arriba.png";
import IconArrowAbajo from "./images/abajo.png";
import IconArrowIzquierda from "./images/izquierda.png";
import IconArrowDerecha from "./images/derecha.png";
import { ButtonImage } from "./button-image";
export interface OutputDataInterface {
  name: string;
  colorLabel: string;
  pin: number;
  state: number;
}

const outputs = {
  Up: { name: "up", image: IconArrowArriba },
  Down: { name: "down", image: IconArrowAbajo },
  Left: { name: "left", image: IconArrowDerecha },
  Right: { name: "right", image: IconArrowIzquierda },
  wheel1: { name: "wheel1", image: IconRueda },
  wheel2: { name: "wheel2", image: IconRueda },
  wheel3: { name: "wheel3", image: IconRueda },
  wheel4: { name: "wheel4", image: IconRueda },
};
export const CardImage = () => {
  return (
    <Box
      sx={{
        display: "flex",
        width: "30%",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
      }}
    >
      <Box id="row1">
        <ButtonImage data={outputs.Up} />
      </Box>

      <Box
        id="row2"
        sx={{
          display: "flex",
          width: "30%",
          justifyContent: "center",
          alignItems: "center",
          padding: "2em",
        }}
      >
        <ButtonImage data={outputs.Right} />
        <Box sx={{ display: "flex", flexDirection: "column" }}>
          <ButtonImage data={outputs.wheel1} />
          <ButtonImage data={outputs.wheel3} />
        </Box>
        <Box sx={{ display: "flex", flexDirection: "column", width: "33%" }}>
          <img src={ChasisCar} alt="icon info traveler" />
        </Box>
        <Box sx={{ display: "flex", flexDirection: "column" }}>
          <ButtonImage data={outputs.wheel2} />
          <ButtonImage data={outputs.wheel4} />
        </Box>
        <Box>
          <ButtonImage data={outputs.Left} />
        </Box>
      </Box>
      <Box id="row3">
        <ButtonImage data={outputs.Down} />
      </Box>
    </Box>
  );
};
