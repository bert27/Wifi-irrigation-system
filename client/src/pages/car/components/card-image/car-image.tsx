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
    <div
      style={{
        display: "flex",
        width: "50%",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
      }}
    >
      <div id="row1">
        <ButtonImage data={outputs.Up} />
      </div>

      <div
        id="row2"
        style={{
          display: "flex",
          width: "30%",
          justifyContent: "center",
          alignItems: "center",
          padding: "2em",
        }}
      >
        <ButtonImage data={outputs.Right} />
        <div style={{ display: "flex", flexDirection: "column" }}>
          <ButtonImage data={outputs.wheel1} />
          <ButtonImage data={outputs.wheel3} />
        </div>
        <div style={{ display: "flex", flexDirection: "column", width: "33%" }}>
          <img src={ChasisCar} alt="icon info traveler" />
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <ButtonImage data={outputs.wheel2} />
          <ButtonImage data={outputs.wheel4} />
        </div>
        <div>
          <ButtonImage data={outputs.Left} />
        </div>
      </div>
      <div id="row3">
        <ButtonImage data={outputs.Down} />
      </div>
    </div>
  );
};
