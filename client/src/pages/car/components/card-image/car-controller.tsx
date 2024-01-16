import { Box } from "@mui/material";

import IconRueda from "./images/rueda.png";
import ChasisCar from "./images/car.png";

import IconArrowArriba from "./images/arriba.png";
import IconArrowAbajo from "./images/abajo.png";
import IconArrowIzquierda from "./images/izquierda.png";
import IconArrowDerecha from "./images/derecha.png";
import { ButtonImage } from "./components/button-image";
import { ResponseWebSocketInterface } from "../../car-page";
import { ArrowControl } from "./components/arrow-control";
export interface OutputDataInterface {
  name: string;
  colorLabel: string;
  pin: number;
  state: number;
}

const outputs = {
  Up: { name: "Arriba", image: IconArrowArriba },
  Down: { name: "Abajo", image: IconArrowAbajo },
  Left: { name: "Izquierda", image: IconArrowDerecha },
  Right: { name: "Derecha", image: IconArrowIzquierda },
  wheel1: { name: "wheel1", image: IconRueda },
  wheel2: { name: "wheel2", image: IconRueda },
  wheel3: { name: "wheel3", image: IconRueda },
  wheel4: { name: "wheel4", image: IconRueda },
};
interface CardControllerProps {
  recibedMessage: ResponseWebSocketInterface;
}

export const CardController = (props: CardControllerProps) => {
  const { recibedMessage } = props;

  return (
    <div
      style={{
        display: "flex",
        width: "30%",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
      }}
    >
      <div id="row1">
        <ArrowControl
          data={outputs.Up}
          recibedMessage={recibedMessage}
          id={"Arriba"}
        />
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
        <ArrowControl
          data={outputs.Right}
          recibedMessage={recibedMessage}
          id={"Izquierda"}
        />
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
          <ArrowControl
            data={outputs.Left}
            recibedMessage={recibedMessage}
            id={"Derecha"}
          />
        </div>
      </div>
      <div id="row3">
        <ArrowControl
          data={outputs.Down}
          recibedMessage={recibedMessage}
          id={"Abajo"}
        />
      </div>
    </div>
  );
};
