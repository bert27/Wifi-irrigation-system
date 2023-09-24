import { Box, Grid, Typography } from "@mui/material";
import { useState } from "react";
import { robotService } from "../../../services/robot-service";

export const CardOutputs = (props: any) => {
  const size = "3em";

  const circlesInitialize = [
    {
      color: "red",
      name: "Motor A1",
      colorLabel: "blue",
    },
    {
      color: "red",
      name: "Motor A2",
      colorLabel: "yellow",
    },
    {
      color: "red",
      name: "Motor B1",
      colorLabel: "black",
    },
    {
      color: "red",
      name: "Motor B2",
      colorLabel: "#969696",
    },
    {
      color: "red",
      name: "Motor C1",
      colorLabel: "purple",
    },
    {
      color: "red",
      name: "Motor C2",
      colorLabel: "green",
    },
  ];
  const [circles, setCircles] = useState(circlesInitialize);

  const sendDataToServer = async (outputSelected: number, value: boolean) => {
    const response = await robotService.sendDataOutputSelectedToServer({
      output: outputSelected,
      value: value,
    });
    console.log("response", response);
  };

  const handleClick = (index: number) => {
    const circlesCopy = [...circles];
    const circleActual = circlesCopy[index];

    circleActual.color = circleActual.color === "green" ? "red" : "green";
    setCircles([...circles.map((c, i) => (i === index ? circleActual : c))]);

    sendDataToServer(index + 1, circleActual.color === "green" ? true : false);
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
              <Box sx={{ background: circle.colorLabel, width: "100%",height: "1em" }}></Box>
            </Box>

            <Box
              sx={{
                backgroundColor: circle.color,
                borderRadius: "50%",
                width: size,
                height: size,
                margin: "2em",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
              onClick={() => handleClick(index)}
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
        </Grid>
      ))}
    </Grid>
  );
};
