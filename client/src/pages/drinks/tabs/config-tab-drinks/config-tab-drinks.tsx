import { Alert, Grid, Paper, Snackbar, Typography } from "@mui/material";
import { plantaService } from "../../../../services/PlantaController.service";

import { CardConfigTab } from "./card-config-tab";
import { useState } from "react";
import { AlertComponent } from "../../../../components/Alert/alert-component";

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
  const [messageUi, setMessageUi] = useState(undefined as undefined | string);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const sendFormDataServer = async (
    data: { pwm: number; timeCalibration: number },
    id: number
  ) => {
    const responseStateServer = await plantaService.getWaterPump1OnOFF({
      id,
      pwm: data.pwm,
      timeCalibration: data.timeCalibration,
    });
    if (responseStateServer === "OK") {
      setMessageUi("Status changed on server successfully");
      setOpenSnackbar(true);
      setTimeout(() => {
        setOpenSnackbar(false);
        setMessageUi(undefined);
      }, 2000);
    }

    const cardsResponseCopy = [...cardsResponse];

    cardsResponseCopy.forEach((element) => {
      if (element.id === id) {
        element.pwm = data.pwm;
        element.timeCalibration = data.timeCalibration;
        setCardsResponse(cardsResponseCopy);
      }
    });
  };

  return (
    <>
      <AlertComponent
        open={openSnackbar}
        message={messageUi}
        setOpenSnackbar={setOpenSnackbar}
      />

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
