import { Box, Button, Card, CardContent, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { HexColorPicker } from "react-colorful";
import "./styles.css";
import { robotService } from "../../services/robot-service";
import { CardOutputs } from "./components/card-outputs";
import { TableOutputs } from "./components/table-outputs";
import { CardController } from "./components/card-image/car-controller";
import { MpuGraphic } from "./components/giroscope/mpu-graphic";
import { ValuesEchart } from "./components/giroscope/values-echart";
import { ReadWebSocket } from "./components/console/read-web-socket";
import { ReadWebSocket2 } from "./components/console/read-web-socket2";

export interface ResponseWebSocketInterface {
  ledState: boolean | undefined;
  jostickDirection: string | undefined;
  giroscope: string | undefined;
  giroscopeValues: number[];
}

export const CarPage = (props: any) => {
  //192.168.1.230
  const urlEsp8266 = "ws://192.168.1.230/ws";

  const [recibedMessage, setRecibedMessage] = useState({
    ledState: undefined,
    jostickDirection: undefined,
    giroscope: undefined,
    giroscopeValues: [0, 0],
  } as ResponseWebSocketInterface);

  const [colourSelected, setcolourSelected] = useState("#aabbcc");

  // console.log("colourSelected", colourSelected);
  const [ws, setWs] = useState(null as WebSocket | null);
  const [connectedMessage, setConnectedMessage] = useState("No conectasdo");

  useEffect(() => {
    const url = urlEsp8266;
    const ws = new WebSocket(url);
    ws.onopen = () => {
      setConnectedMessage("Conectado al servidor");
      ws.send("react is open");
    };
    ws.onmessage = (event: { data: string }) => {
      // console.log("mensaje recibido: ", event.data);
      setRecibedMessage(JSON.parse(event.data));
    };
    setWs(ws);

    /*  ws.addEventListener("open", (event) => {
      console.log("Conectado")
    })*/
  }, []);

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
        padding: "1em",
        color: "white",
        width: "90%",
      }}
      component="div"
    >
      <div
        style={{
          display: "flex",
          width: "100%",
          justifyContent: "space-between",
          marginBottom: "0.5em",
          alignItems: "center",
        }}
      >
        <div>{connectedMessage}</div>
        <ReadWebSocket2
          recibedMessage={recibedMessage}
          setRecibedMessage={setRecibedMessage}
        />
        <div style={{ width: "20%" }}>
          <Button
            data-testid="button-send-websocket"
            variant="contained"
            sx={{ backgroundColor: "#576CBC" }}
            onClick={() => {
              ws?.send("toggle");
            }}
          >
            Enviar mensaje
          </Button>
        </div>
      </div>
      <Card>
        <CardContent>
          <Box
            component="div"
            sx={{
              display: "flex",
              width: "100%",
              justifyContent: "space-evenly",
              alignItems: "center",
            }}
          >
            <CardController recibedMessage={recibedMessage} />
            <Box
              component="div"
              sx={{
                display: "flex",
                width: "60%",
                justifyContent: "space-evenly",
                alignItems: "center",
                background: "#100c2a",
                padding: "1em",
              }}
            >
              <ValuesEchart
                data={{
                  title: "Grados Eje X",
                  value: parseFloat(
                    recibedMessage.giroscopeValues[0].toFixed(2)
                  ),
                }}
              />
              <ValuesEchart
                data={{
                  title: "Grados Eje Y",
                  value: parseFloat(
                    recibedMessage.giroscopeValues[1].toFixed(2)
                  ),
                }}
              />
              <MpuGraphic
                data={{ height: "150px", width: "100%" }}
                recibedMessage={recibedMessage}
              />
            </Box>
          </Box>
          <Box
            component="div"
            id="column-2"
            sx={{
              display: "flex",
              width: "100%",
              justifyContent: "space-between",
              background: "#100c2a",
              padding: "0.4em"
            }}
          >
            <CardOutputs />
            <Box
              style={{
                display: "flex",
                flexDirection: "column",
                width: "40%",
                marginBottom: "10px",
                justifyContent: "center",
              }}
              component="div"
              id="content-color"
            >
              <Box component="div">
                <Typography fontSize={20}>Color Seleccionado:</Typography>
                <Typography
                  fontSize={20}
                  style={{ color: `${colourSelected}`, marginLeft: "20px" }}
                >
                  {colourSelected}
                </Typography>
              </Box>
              <Box
                sx={{
                  display: "flex",
                }}
                component="div"
              >
                <HexColorPicker
                  color={colourSelected}
                  onChange={changeHexColorPicker}
                />
              </Box>
            </Box>
          </Box>
 

          {/*  <TableOutputs />*/}
        </CardContent>
      </Card>
    </Box>
  );
};
