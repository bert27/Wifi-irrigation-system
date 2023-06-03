import { Grid, Paper, Typography } from "@mui/material";
import { plantaService } from "../../../../services/PlantaController.service";

import { CardConfigTab } from "./card-config-tab";
import { useState } from "react";

export interface WaterPumpInterface {
  id: number;
  title: string;
  liquid: string;
  pwm: number;
  timeCalibration: number;
}

const waterPumps = [
  {
    id: 1,
    title: "Water pump 1",
    liquid: "water",
    pwm: 20,
    timeCalibration: 0,
  },
  {
    id: 2,
    title: "Water pump 2",
    liquid: "cocacola",
    pwm: 0,
    timeCalibration: 0,
  },
  {
    id: 3,
    title: "Water pump 3",
    liquid: "orange",
    pwm: 20,
    timeCalibration: 0,
  },
  {
    id: 4,
    title: "Water pump 4",
    liquid: "lemon",
    pwm: 20,
    timeCalibration: 0,
  },
] as WaterPumpInterface[];

export const ConfigTabDrinks = () => {

  const [cardsResponse, setCardsResponse] = useState(waterPumps);
  const sendFormDataServer = async (
    data: { pwm: number; timeCalibration: number },
    id: number
  ) => {
    console.log(data, id);
    const responseStateServer = await plantaService.postWaterPump1OnOFF();
  };

  return (
    <>
      <Paper elevation={2} sx={{ padding: "1em", background: "#C0C999" }}>
        <Typography variant="h6" gutterBottom>
          Config:
        </Typography>
        <Grid container spacing={3}>
          {cardsResponse.map((card) => (
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
