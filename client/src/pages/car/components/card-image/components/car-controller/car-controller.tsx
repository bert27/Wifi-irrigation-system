import IconRueda from "pages/car/components/card-image/images/rueda.png";
import ChasisCar from "pages/car/components/card-image/images/car.png";
import IconArrowArriba from "pages/car/components/card-image/images/arriba.png";
import IconArrowAbajo from "pages/car/components/card-image/images/abajo.png";
import IconArrowIzquierda from "pages/car/components/card-image/images/izquierda.png";
import IconArrowDerecha from "pages/car/components/card-image/images/derecha.png";
import { ButtonImage } from "../button-image";
import { ResponseWebSocketInterface } from "../../../../car-page";
import { ArrowControl } from "../arrow-control";
import { robotService } from "../../../../../../services/robot-service";
import { Box } from "@mui/material";
import { ChangeEvent, useState } from "react";
import { SliderLineComponent } from "pages/car/components/sub-components/slider";
import { InputNumber } from "pages/car/components/sub-components/input-number";

export interface OutputDataInterface {
  name: string;
  colorLabel: string;
  pin: number;
  state: number;
}

const outputs = {
  Up: { name: "Arriba", image: IconArrowArriba },
  Down: { name: "Abajo", image: IconArrowAbajo },
  Right: { name: "Derecha", image: IconArrowDerecha },
  Left: { name: "Izquierda", image: IconArrowIzquierda },
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

  const [dataToEsp32, setDataToEsp32] = useState({
    time: 1000,
    pwm: 140,
  });

  const handleDirection = async (name: string) => {
    console.log("name", name);
    const response = await robotService.sendOutputRobotUI({ name: name });
    console.log("response", response);
  };

  const handleSlider = (valuePwmTmp: number) => {
    setDataToEsp32({ ...dataToEsp32, pwm: valuePwmTmp });
  };

  const handleTime = (timeSelect: number) => {
    setDataToEsp32({ ...dataToEsp32, time: timeSelect });
  };

  return (
    <Box
      component="div"
      sx={{
        display: "flex",
        width: "100%",
        justifyContent: "space-evenly",
        alignItems: "center",
      }}
      id="car-controller"
    >
      <Box component="div" id="controls-details" sx={{ width: "50%" }}>
        <Box component="div">
          <InputNumber
            value={dataToEsp32.time}
            onChange={handleTime}
            label={"Tiempo:"}
          />
        </Box>
        <Box component="div">
          <SliderLineComponent
            onChangePwmValue={handleSlider}
            valuePwm={dataToEsp32.pwm}
            label={"Potencia"}
          />
        </Box>
      </Box>

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
            handleDirection={handleDirection}
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
            handleDirection={handleDirection}
            data={outputs.Left}
            recibedMessage={recibedMessage}
            id={"Izquierda"}
          />
          <div style={{ display: "flex", flexDirection: "column" }}>
            <ButtonImage
              handleDirection={handleDirection}
              data={outputs.wheel1}
            />
            <ButtonImage
              handleDirection={handleDirection}
              data={outputs.wheel3}
            />
          </div>
          <div
            style={{ display: "flex", flexDirection: "column", width: "33%" }}
          >
            {recibedMessage.buttonState === "on" ? "ON" : "OFF"}{" "}
            <img src={ChasisCar} alt="icon info traveler" />
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <ButtonImage
              handleDirection={handleDirection}
              data={outputs.wheel2}
            />
            <ButtonImage
              handleDirection={handleDirection}
              data={outputs.wheel4}
            />
          </div>
          <div>
            <ArrowControl
              handleDirection={handleDirection}
              data={outputs.Right}
              recibedMessage={recibedMessage}
              id={"Derecha"}
            />
          </div>
        </div>
        <div id="row3">
          <ArrowControl
            handleDirection={handleDirection}
            data={outputs.Down}
            recibedMessage={recibedMessage}
            id={"Abajo"}
          />
        </div>
      </div>
    </Box>
  );
};
