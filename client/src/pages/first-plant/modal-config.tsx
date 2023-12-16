import { Box, Button, Modal, Typography } from "@mui/material";
import { useState } from "react";
import { ReactComponent as IcoWaterOn } from "./../../icons/waterOn.svg";
import { ReactComponent as IcoWaterOff } from "./../../icons/waterOff.svg";

import { plantaService } from "../../services/PlantaController.service";
interface ModalConfigProps {
  isOpenModalConfig: boolean;
  setIsOpenModalConfig: React.Dispatch<React.SetStateAction<boolean>>;
  stateWaterPump: string;
  setstateWaterPump: React.Dispatch<React.SetStateAction<string>>;
}

export const ModalConfig = (props: ModalConfigProps) => {
  const {
    isOpenModalConfig,
    setIsOpenModalConfig,
    setstateWaterPump,
    stateWaterPump,
  } = props;

  async function changeStateWatterPump1() {
    const responseStateServer = await plantaService.getWaterPump1OnOFF();
    setstateWaterPump(responseStateServer);
  }

  const styleModal = {
    width: "80%",
    position: "absolute" as "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    webkitTransform: "translate(-50%, -50%)",

    bgcolor: "#282828",
    border: "2px solid #000",
    boxShadow: 24,
    p: 4,
    overflowY: "auto",
    maxHeight: "80vh",
  };
  return (
    <>
      <Modal
        open={isOpenModalConfig}
        onClose={() => setIsOpenModalConfig(false)}
        aria-labelledby="parent-modal-title"
        aria-describedby="parent-modal-description"
      >
        <Box sx={styleModal} component="div">
          <Typography variant="h6" gutterBottom sx={{ color: "white" }}>
            Configura las bombas:
          </Typography>
          <div className="optionsPlanta">
            <div className="cardPlanta_option">
              <Typography variant="h6" gutterBottom sx={{ color: "white" }}>
                water pump 1:{" "}
                {stateWaterPump === "ON" ? (
                  <IcoWaterOn className="buttonsvg" />
                ) : (
                  <IcoWaterOff className="buttonsvg" />
                )}{" "}
                {stateWaterPump}
              </Typography>

              <Button
                sx={{ backgroundColor: "#009688" }}
                variant="contained"
                onClick={changeStateWatterPump1}
              >
                {stateWaterPump === "ON" ? "SET PAUSE" : "SET ON"}
              </Button>
            </div>
          </div>
        </Box>
      </Modal>
    </>
  );
};

/*
    async function getTestStatePump() {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_API_DIR}/waterPump1OnOFF`
        );
        if (!response.ok) {
          throw new Error("error getting pump status from server");
        }
        const responseStateServer = await response.json();
        setstateWaterPump(responseStateServer);
      } catch (error) {
        setErrorGet(`Error: ${error}`);
      }
    }

    //   getTestStatePump(); */
