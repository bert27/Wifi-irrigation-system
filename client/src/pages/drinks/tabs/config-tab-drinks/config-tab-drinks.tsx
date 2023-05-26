import { Grid, Paper, Typography } from "@mui/material";
import { useState } from "react";
import { plantaService } from "../../../../services/PlantaController.service";

import { CardConfigTab, SliderComponent } from "./card-config-tab";

const waterPumps = [
  { id: 1, title: "Water pump 1" },
  { id: 2, title: "Water pump 2" },
  { id: 3, title: "Water pump 3" },
  { id: 4, title: "Water pump 4" },
];

export const ConfigTabDrinks = () => {


  const sendFormDataServer = async (
    data: {  pwm: number;
      timeCalibration: number },
    id: number
  ) => {
    console.log(data,id)
    const responseStateServer = await plantaService.postWaterPump1OnOFF();

  };


  return (
    <>
      <Paper elevation={2} sx={{ padding: "1em", background: "#C0C999" }}>
        <Typography variant="h6" gutterBottom>
          Config:
        </Typography>
        <Grid container spacing={3}>
          {waterPumps.map((card) => (
            <Grid key={card.id} item xs={12} sm={6} md={4}>
              <CardConfigTab
                sendFormDataServer={sendFormDataServer}
                card={card}
              />
            </Grid>
          ))}
        </Grid>
      </Paper>
    </>
  );
};
