import { Box, Card, CardContent, Typography } from "@mui/material";
import { useState } from "react";
import { HexColorPicker } from "react-colorful";
import "./styles.css";
import { robotService } from "../../services/robot-service";
import { CardOutputs } from "./components/card-outputs";
export const CarPage = (props: any) => {
  const [colourSelected, setcolourSelected] = useState("#aabbcc");
  console.log("colourSelected", colourSelected);

  const sendDataToServer = async (newColor: string) => {
    const response = await robotService.sendDataColorToServer({
      color: newColor,
    });
    console.log("response", response);
  };

  const changeHexColorPicker = (newColor: string) => {
    console.log("newColor", newColor);
    setcolourSelected(newColor);
    sendDataToServer(newColor);
  };
  return (
    <Box
      sx={{
        backgroundColor: "#0B2447",
        minHeight: "100vh",
        padding: "2em",
        color: "white",
        width: "100%",
      }}
    >
      <Card>
        <CardContent>
          <Box sx={{ display: "flex",justifyContent: "space-around",alignItems: "center" }}>
            <Box>
              <Box
                style={{ display: "flex", width: "50%", marginBottom: "10px" }}
              >
                <Typography fontSize={20}>Color Seleccionado:</Typography>
                <Typography
                  fontSize={20}
                  style={{ color: `${colourSelected}`, marginLeft: "20px" }}
                >
                  {colourSelected}
                </Typography>
              </Box>
              <Box>
                <HexColorPicker
                  color={colourSelected}
                  onChange={changeHexColorPicker}
                />
              </Box>
            </Box>
            <CardOutputs />
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};
