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
}) => {
  const { onChangePwmValue } = props;

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
        <SliderComponent onChangeValue={onChangePwmValue} valueSlider={255} />
      </Box>
    </>
  );
};

export const CardOutputs = () => {
  const size = "3em";

  const outputsData = [
    {
      name: "Motor A1",
      colorLabel: "blue",
      pin: 14,
      state: 0,
    },
    {
      name: "Motor A2",
      colorLabel: "yellow",
      pin: 25,
      state: 0,
    },
    {
      name: "Motor B1",
      colorLabel: "black",
      pin: 27,
      state: 0,
    },
    {
      name: "Motor B2",
      colorLabel: "#969696",
      pin: 26,
      state: 0,
    },
    {
      name: "Motor C1",
      colorLabel: "purple",
      pin: 40,
      state: 0,
    },
    {
      name: "Motor C2",
      colorLabel: "green",
      pin: 50,
      state: 0,
    },
  ] as OutputDataInterface[];
  const [circles, setCircles] = useState(outputsData);
  const [valuePwm, setValuePwm] = useState(255);
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
    <Grid container width={"26em"} spacing={1}>
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
                }}
              >
                {index + 1}
              </Typography>
            </Box>
          </Box>
          <SliderLineComponent onChangePwmValue={onChangePwmValue} />
        </Grid>
      ))}
    </Grid>
  );
};
