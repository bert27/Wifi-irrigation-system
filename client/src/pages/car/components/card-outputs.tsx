import { Box, Grid, Typography } from "@mui/material";
import { useState } from "react";
import { robotService } from "../../../services/robot-service";
import { SliderComponent } from "../../drinks/tabs/config-tab-drinks/components/slider-material";
import { color } from "../../drinks/tabs/config-tab-drinks/card-config-tab";

export interface OutputDataInterface {
  name: string;
  colorLabel: string;
  pin: number;
  state: number;
}

export const SliderLineComponent = (props: {
  onChangePwmValue: (pwmTmp: number) => void;
  valuePwm: number;
}) => {
  const { onChangePwmValue, valuePwm } = props;

  return (
    <>
      <Typography
        variant="subtitle2"
        gutterBottom={false}
        sx={{ fontWeight: "bold", color: color }}
      >
        PWM:
      </Typography>
      <Box
        sx={{
          display: "flex",
          width: "100%",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <SliderComponent
          onChangeValue={onChangePwmValue}
          valueSlider={valuePwm}
        />
      </Box>
    </>
  );
};

export const CardOutputs = () => {
  const size = "3em";

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
  return (
    <Grid container width={"26em"} height={"100%"} spacing={1}>
      {circles.map((circle, index) => (
        <Grid item xs={6} key={index}>
          <Box
            display={"flex"}
            alignItems="center"
            sx={{
              flexFlow:
                index === 1 || index === 3 || index === 5 ? "row-reverse" : "",
            }}
          >
            <Box>
              <Typography
                variant="body2"
                color="black"
                sx={{ textAlign: "center", fontSize: "1em" }}
              >
                {circle.name}
              </Typography>
              <Box
                sx={{
                  background: circle.colorLabel,
                  width: "100%",
                  height: "1em",
                }}
              ></Box>
            </Box>

            <Box
              sx={{
                backgroundColor: circle.state ? "green" : "red",
                borderRadius: "50%",
                width: size,
                height: size,
                margin: "2em",
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
                  fontSize: "2em",
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
        </Grid>
      ))}
    </Grid>
  );
};
