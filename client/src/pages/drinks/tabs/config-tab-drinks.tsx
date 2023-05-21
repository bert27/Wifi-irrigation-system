import { Box, Button, Paper, TextField, Typography } from "@mui/material";
import { useState } from "react";

export const ConfigTabDrinks = (props: any) => {
  const [formData, setformData] = useState({
    pwm: 0,
    statePump: "OFF",
  });

  const onChangePWM = (pwmTmp: string) => {
    setformData({ ...formData, pwm: parseInt(pwmTmp) });
  };

  const onChangeStatePumpButton = () => {
    if (formData.statePump === "OFF") {
      setformData({ ...formData, statePump: "ON" });
    } else {
      setformData({ ...formData, statePump: "OFF" });
    }
  };

  const sendFormData = () => {};
  return (
    <>
      <Paper elevation={2} sx={{ padding: "1em" }}>
        <Typography variant="h6" gutterBottom>
          Config:
        </Typography>
        <Box
          sx={{
            display: "flex",
            alignItems: "baseline",
            justifyContent: "space-between",
            width: "40%",
          }}
        >
          <Typography variant="h6" gutterBottom>
            {formData.statePump}
          </Typography>
          <Button
            sx={{ backgroundColor: "#009688" }}
            variant="contained"
            onClick={onChangeStatePumpButton}
          >
            {formData.statePump === "ON" ? "PAUSE" : "ON"}
          </Button>
        </Box>
        <Box
          sx={{
            display: "flex",
            alignItems: "baseline",
            justifyContent: "space-between",
            width: "40%",
          }}
        >
          <TextField
            fullWidth={false}
            label={"Water pump pwm"}
            value={formData.pwm}
            type={"number"}
            placeholder={"Nombre"}
            variant={"standard"}
            onChange={(
              e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
            ) => {
              onChangePWM(e.currentTarget.value);
            }}
          />
          <Button
            sx={{ backgroundColor: "#009688" }}
            variant="contained"
            onClick={sendFormData}
          >
            {"set"}
          </Button>
        </Box>
      </Paper>
    </>
  );
};
