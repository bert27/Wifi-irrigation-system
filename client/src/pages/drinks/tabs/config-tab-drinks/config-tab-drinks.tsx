import { Grid, Paper, Typography } from "@mui/material";
import { useState } from "react";
import { plantaService } from "../../../../services/PlantaController.service";

import { CardConfigTab } from "./card-config-tab";

const waterPumps = [
  { id: 1, title: "Water pump 1" },
  { id: 2, title: "Water pump 2" },
  { id: 3, title: "Water pump 3" },
  { id: 4, title: "Water pump 4" },
];

export const ConfigTabDrinks = () => {
  const [formData, setformData] = useState({
    pwm: 0,
    statePump: "OFF",
  });

  const onChangePWM = (pwmTmp: string) => {
    setformData({ ...formData, pwm: parseInt(pwmTmp) });
  };

  const onChangeStatePumpButton = async () => {
    const responseStateServer = await plantaService.postWaterPump1OnOFF();
    if (formData.statePump === "OFF" && responseStateServer === "OFF") {
      setformData({ ...formData, statePump: "ON", pwm: 255 });
    } else {
      setformData({ ...formData, statePump: "OFF", pwm: 0 });
    }
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
                onChangePWM={onChangePWM}
                formData={formData}
                onChangeStatePumpButton={onChangeStatePumpButton}
                title={card.title}
              />
            </Grid>
          ))}
        </Grid>
      </Paper>
    </>
  );
};
