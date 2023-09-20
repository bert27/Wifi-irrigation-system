import { Box, Card, CardContent, Grid, Typography } from "@mui/material";
import React, { useState, useEffect } from "react";

export const CardOutputs = (props: any) => {
  const size = "3em";
  const numCircles = 6;

  const circlesInitialize = [
    {
      color: "red",
      name: "Círculo 1",
    },
    {
      color: "red",
      name: "Círculo 2",
    },
    {
      color: "red",
      name: "Círculo 3",
    },
    {
      color: "red",
      name: "Círculo 4",
    },
    {
      color: "red",
      name: "Círculo 5",
    },
    {
      color: "red",
      name: "Círculo 6",
    },
  ];
  const [selectedCircle, setSelectedCircle] = useState(null);
  const [circles, setCircles] = useState(circlesInitialize);

  const handleClick = (index: number) => {
    const circlesCopy = [...circles];
    const circleActual = circlesCopy[index];

    circleActual.color = circleActual.color === "red" ? "green" : "red";
    setCircles([...circles.map((c, i) => (i === index ? circleActual : c))]);
  };

  return (
    <Grid container width={"8em"} spacing={1}>
      {circles.map((circle, index) => (
        <Grid item xs={6} key={index}>
          <Box
            sx={{
          //    display: "flex",
         //     alignItems: "center",
           //   justifyContent: "center",
            }}
          >
            {/*          <Box>
            <Typography
              variant="body2"
              color="black"
              sx={{ textAlign: "center", fontSize: "1em" }}
            >
              {circle.name}
            </Typography>
      </Box>*/}
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
