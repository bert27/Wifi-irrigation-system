import { Box, Card, CardContent, Typography } from "@mui/material";
import { useState } from "react";
import { HexColorPicker } from "react-colorful";
import "./styles.css";
import { robotService } from "../../services/robot-service";
import { CardOutputs } from "./components/card-outputs";
import { TableOutputs } from "./components/table-outputs";
import { CardImage } from "./components/card-image/car-image";
import { MpuGraphic } from "./components/giroscope/mpu-graphic";
import { ValuesEchart } from "./components/giroscope/values-echart";
import { ReadWebSocket } from "./components/console/read-web-socket";
import { ReadWebSocket2 } from "./components/console/read-web-socket2";
export const CarPage = (props: any) => {
  const [colourSelected, setcolourSelected] = useState("#aabbcc");
 // console.log("colourSelected", colourSelected);

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
      component="div"
    >
      <Card>
        <CardContent>
          <ReadWebSocket2 />
          <div style={{ display: "flex", width: "100%" }}>
            <Box
              component="div"
              id="giroscope"
              sx={{
                display: "flex",
                flexDirection: "column",
                background: "#100c2a",
                justifyContent: "center",
                alignItems: "center",
                width: "50%",
                padding: "1em",
              }}
            >
              <MpuGraphic data={{ height: "200px", width: "50%" }} />
              <Box
                component="div"
                sx={{
                  display: "flex",
                  width: "100%",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <ValuesEchart data={{ title: "Grados Eje X", value: 70 }} />
                <ValuesEchart data={{ title: "Grados Eje Y", value: 50 }} />
              </Box>
            </Box>

            <CardImage />
          </div>

          <Box
            sx={{
              display: "flex",
              justifyContent: "space-around",
              alignItems: "center",
            }}
            component="div"
          >
            <div>
              <Box
                style={{ display: "flex", width: "50%", marginBottom: "10px" }}
                component="div"
              >
                <Typography fontSize={20}>Color Seleccionado:</Typography>
                <Typography
                  fontSize={20}
                  style={{ color: `${colourSelected}`, marginLeft: "20px" }}
                >
                  {colourSelected}
                </Typography>
              </Box>
              <div>
                <HexColorPicker
                  color={colourSelected}
                  onChange={changeHexColorPicker}
                />
              </div>
            </div>

            <CardOutputs />
          </Box>
          <TableOutputs />
        </CardContent>
      </Card>
    </Box>
  );
};
