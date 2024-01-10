import React, { useState, useEffect } from "react";
import { ConsoleComponent } from "./console-component";
import { Button } from "@mui/material";

export interface ResponseWebSocketInterface {
  ledState: boolean | undefined;
  jostickDirection: string | undefined;
  giroscope: string | undefined;
}

//192.168.1.230
const urlEsp8266 = "ws://192.168.1.230/ws";

export const ReadWebSocket2 = () => {
  const [ws, setWs] = useState(null as WebSocket | null);
  const [connectedMessage, setConnectedMessage] = useState("No conectasdo");
  const [recibedMessage, setRecibedMessage] = useState({
    ledState: undefined,
    jostickDirection: undefined,
    giroscope: undefined,
  } as ResponseWebSocketInterface);

  useEffect(() => {
    const url = urlEsp8266;
    const ws = new WebSocket(url);
    ws.onopen = () => {
      setConnectedMessage("Conectado al servidor");
      ws.send("react is open");
    };
    ws.onmessage = (event: { data: string }) => {
      console.log("mensaje recibido: ", event.data);
      setRecibedMessage(JSON.parse(event.data));
    };
    setWs(ws);

    /*  ws.addEventListener("open", (event) => {
      console.log("Conectado")
    })*/
  }, []);
  console.log(recibedMessage);
  return (
    <>
      <div>
        <div>{connectedMessage}</div>

        <div style={{ marginTop: "1em", marginBottom: "1em" }}>
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

        <ConsoleComponent message={recibedMessage} />
      </div>
    </>
  );
};
