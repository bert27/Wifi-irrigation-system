import React, { useState, useEffect } from "react";
import { ConsoleComponent } from "./console-component";
import { Button } from "@mui/material";
import { ResponseWebSocketInterface } from "../../car-page";

interface ReadWebSocket2Props {
  recibedMessage: ResponseWebSocketInterface;
  setRecibedMessage: React.Dispatch<
    React.SetStateAction<ResponseWebSocketInterface>
  >;
}

export const ReadWebSocket2 = (props: ReadWebSocket2Props) => {
  const { recibedMessage, setRecibedMessage } = props;

  // console.log(recibedMessage);
  return (
    <>
      <div
        style={{
          display: "flex",
          width: "60%",
          justifyContent: "space-between",
        }}
      >
        <ConsoleComponent message={recibedMessage} />
      </div>
    </>
  );
};
