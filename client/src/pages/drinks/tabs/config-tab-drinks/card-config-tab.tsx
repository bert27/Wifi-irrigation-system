import { Box, Button, Card, CardContent, Typography } from "@mui/material";
import { ReactComponent as IcoWaterOn } from "../../../../icons/waterOn.svg";
import { ReactComponent as IcoWaterOff } from "../../../../icons/waterOff.svg";
import { useState } from "react";
import type { WaterPumpInterface } from "./config-tab-drinks";
import { SliderComponent } from "./components/slider-material";

export const color = "#009688";

interface CardConfigTabProps {
  card: WaterPumpInterface;

  sendFormDataServer: (
    data: {
      pwm: number;
      timeCalibration: number;
    },
    id: number
  ) => void;
}

export const CardConfigTab = (props: CardConfigTabProps) => {
  const { sendFormDataServer, card } = props;
  const [cardForm, setCarForm] = useState({
    pwm: card.pwm,
    timeCalibration: card.timeCalibration,
  });

  const onChangeBinaryValue = () => {
    if (cardForm.pwm > 0) {
      setCarForm({ ...cardForm, pwm: 0 });
      sendFormDataServer(
        {
          ...cardForm,
          pwm: 0,
        },
        card.id
      );
    } else {
      setCarForm({ ...cardForm, pwm: 255 });
      sendFormDataServer(
        {
          ...cardForm,
          pwm: 255,
        },
        card.id
      );
    }
  };

  const onChangePwmValue = (pwmTmp: number) => {
    setCarForm({ ...cardForm, pwm: pwmTmp });
  };
  const onChangeTimeCalibrationValue = (timeCalibrationTmp: number) => {
    setCarForm({ ...cardForm, timeCalibration: timeCalibrationTmp });
  };

  return (
    <Card>
      <CardContent>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Box>
            <Typography
              variant="h6"
              gutterBottom={false}
              sx={{ fontWeight: "bold", color: color }}
            >
              {card.title}
            </Typography>
            <Typography variant="subtitle1" gutterBottom>
              {card.liquid}
            </Typography>
          </Box>
          <Button
            sx={{ backgroundColor: color }}
            variant="contained"
            onClick={onChangeBinaryValue}
          >
            {cardForm.pwm === 0 ? (
              <>
                PAUSE
                <IcoWaterOff className="buttonsvg" style={{ fill: "black" }} />
              </>
            ) : (
              <>
                ON
                <IcoWaterOn className="buttonsvg" style={{ fill: "black" }} />
              </>
            )}
          </Button>
        </Box>

        <Typography
          variant="subtitle2"
          gutterBottom={false}
          sx={{ fontWeight: "bold", color: color }}
        >
          PWM:
        </Typography>
        <Box
          sx={{
            display: "flex",
            width: "100%",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <SliderComponent
            onChangeValue={onChangePwmValue}
            valueSlider={cardForm.pwm}
          />
        </Box>
        <Typography
          variant="subtitle2"
          gutterBottom={false}
          sx={{ fontWeight: "bold", color: color }}
        >
          {"Time Calibration:"}
        </Typography>
        <Box
          sx={{
            display: "flex",
            width: "100%",
            justifyContent: "space-between",

            alignItems: "center",
          }}
        >
          <SliderComponent
            onChangeValue={onChangeTimeCalibrationValue}
            isTime={true}
            valueSlider={cardForm.timeCalibration}
          />
        </Box>
        <Box sx={{ display: "flex", justifyContent: "center" }}>
          <Button
            sx={{ backgroundColor: "#009688" }}
            variant="contained"
            onClick={() => sendFormDataServer(cardForm, card.id)}
          >
            SET
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
};
