import React, { useState, useEffect } from "react";
import { ConsoleComponent } from "./console-component";
import { Button } from "@mui/material";
import { IDashboardState } from "@/pages/car/models/model";

interface ReadWebSocket2Props {
  recibedMessage: IDashboardState;
  setRecibedMessage: React.Dispatch<
    React.SetStateAction<IDashboardState>
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
          width: "50%",
          justifyContent: "space-between",
        }}
      >
        <ConsoleComponent message={recibedMessage} />
      </div>
    </>
  );
};
