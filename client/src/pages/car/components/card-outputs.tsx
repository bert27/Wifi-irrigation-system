import { Box, Typography } from "@mui/material";
import { useState } from "react";
import { robotService } from "../../../services/robot-service";
import { SliderLineComponent } from "./sub-components/slider";

export interface OutputDataInterface {
  name: string;
  colorLabel: string;
  pin: number;
  state: number;
}

export const CardOutputs = () => {
  const outputsData = [
    {
      name: "Rueda Izquierda delante",
      colorLabel: "black",
      pin: 25,
      state: 0,
    },
    {
      name: "Rueda Derecha delante",
      colorLabel: "black",
      pin: 4,
      state: 0,
    },
    {
      name: "Rueda Izquierda atras",
      colorLabel: "yellow",
      pin: 14,
      state: 0,
    },
    {
      name: "Rueda Derecha detras",
      colorLabel: "yellow",
      pin: 19,
      state: 0,
    },
    {
      name: "Rueda Izquierda delante inverso",
      colorLabel: "blue",
      pin: 26,
      state: 0,
    },
    {
      name: "Rueda Derecha delante   inverso",
      colorLabel: "blue",
      pin: 17,
      state: 0,
    },

    {
      name: "Rueda Izquierda atras inverso",
      colorLabel: "white",
      pin: 27,
      state: 0,
    },

    {
      name: "Rueda Derecha detras inverso",
      colorLabel: "white",
      pin: 21,
      state: 0,
    },
  ] as OutputDataInterface[];

  const [circles, setCircles] = useState(outputsData);
  const [valuePwm, setValuePwm] = useState(140);
  const sendDataToServer = async (outputSelected: OutputDataInterface) => {
    const response = await robotService.sendDataOutputSelectedToServer(
      outputSelected
    );
    console.log("response", response);
  };

  const handleClick = (index: number, outputSelect: OutputDataInterface) => {
    const circleActual = outputSelect;

    circleActual.state = circleActual.state === 0 ? valuePwm : 0;
    setCircles([...circles.map((c, i) => (i === index ? circleActual : c))]);
    sendDataToServer(circleActual);
  };
  const onChangePwmValue = (pwmTmp: number) => {
    setValuePwm(pwmTmp);
  };

  const stylesC = {
    width: "24%",
  };
  const size = "2em";
  return (
    <Box
      sx={{
        display: "flex",
        width: "50%",
        // alignItems: "start",
        flexWrap: "wrap",
      }}
      component="div"
    >
      {circles.map((circle, index) => (
        <Box
          component="div"
          sx={{
            display: "flex",
            flexDirection: "column",
            //   background: "green",
            margin: "0.1em",
            width: stylesC.width,
          }}
          key={index}
          id="outPut-card"
        >
          <Box component="div" display={"flex"} alignItems="center">
            <Box component="div">
              <Typography
                variant="body2"
                color="black"
                sx={{ textAlign: "center" }}
              >
                {circle.name}
              </Typography>
              <Box
                component="div"
                sx={{
                  background: circle.colorLabel,
                  width: "100%",
                  height: "0.5em",
                }}
              ></Box>
            </Box>

            <Box
              component="div"
              sx={{
                backgroundColor: circle.state ? "green" : "red",
                borderRadius: "50%",
                width: size,
                height: size,
                margin: "0.5em",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
              onClick={() => handleClick(index, circle)}
            >
              <Typography
                variant="body2"
                color="white"
                sx={{
                  textAlign: "center",
                  fontWeight: "bold",
                  fontSize: "1em",
                  padding: "0.5em",
                }}
              >
                {circle.pin}
              </Typography>
            </Box>
          </Box>
          <SliderLineComponent
            onChangePwmValue={onChangePwmValue}
            valuePwm={valuePwm}
          />
        </Box>
      ))}
    </Box>
  );
};
