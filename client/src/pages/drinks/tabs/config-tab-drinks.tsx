import { Box, Button, Paper, TextField, Typography } from "@mui/material";

export const ConfigTabDrinks = (props: any) => {
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
          <TextField
            fullWidth={false}
            label={"Water pump ON/OFF"}
            value={"ON"}
            type={"string"}
            placeholder={"Nombre"}
            variant={"standard"}
            //onChange={onChangeName}
          />
          <Button sx={{ backgroundColor: "#009688" }} variant="contained">
            {"PAUSE"}
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
            value={255}
            type={"number"}
            placeholder={"Nombre"}
            variant={"standard"}
            //onChange={onChangeName}
          />
          <Button sx={{ backgroundColor: "#009688" }} variant="contained">
            {"set"}
          </Button>
        </Box>
      </Paper>
    </>
  );
};
