import React, { useState, useEffect } from "react";
import { ConsoleComponent } from "./console-component";

//192.168.1.230
const urlEsp8266 = "ws://192.168.1.230/ws";

export const ReadWebSocket2 = () => {
  const [ws, setWs] = useState(null);
  const [connectedMessage, setConnectedMessage] = useState("No conectasdo");

  const [recibedMessage, setRecibedMessage] = useState(undefined);
  useEffect(() => {
    const url = urlEsp8266;
    const ws = new WebSocket(url);
    ws.onopen = () => {
      setConnectedMessage("Conectado al servidor");
    };
    ws.onmessage = (event) => {
      console.log(event.data)
      setRecibedMessage(event.data);
    };
    setWs(ws);

    /*  ws.addEventListener("open", (event) => {
      console.log("Conectado")
    })*/
  }, []);

  return (
    <>
      <div>
        <div>{connectedMessage}</div>
        <button onClick={() => ws?.send("toggle")}>Enviar mensaje</button>
  

        <ConsoleComponent message={recibedMessage} />
      </div>
    </>
  );
};
