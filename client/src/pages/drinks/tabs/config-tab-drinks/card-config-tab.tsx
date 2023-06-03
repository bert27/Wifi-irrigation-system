import {
  Box,
  Button,
  Card,
  CardContent,
  Slider,
  Typography,
} from "@mui/material";
import { ReactComponent as IcoWaterOn } from "../../../../icons/waterOn.svg";
import { ReactComponent as IcoWaterOff } from "../../../../icons/waterOff.svg";
import { useEffect, useState } from "react";
import type { WaterPumpInterface } from "./config-tab-drinks";
const color = "#009688";

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

interface SliderComponentProps {
  onChangeValue: (pwmTmp: number) => void;
  isTime?: boolean;
  valueSlider: number;
}

export const SliderComponent = (props: SliderComponentProps) => {
  const secondsToTime = 20;
  const { onChangeValue, isTime, valueSlider } = props;
  const [value, setValue] = useState(valueSlider as number | number[]);

  const marks = [
    {
      value: 0,
      label: isTime ? "0" : "OFF",
    },
    {
      value: isTime ? secondsToTime : 255,
      label: isTime ? `${secondsToTime}s` : "ON",
    },
  ];

  useEffect(() => {
    setValue(valueSlider as number);
  }, [valueSlider]);

  const handleSliderChange = (event: Event, newValue: number | number[]) => {
    setValue(newValue);
    onChangeValue(newValue as number);
  };

  return (
    <Box sx={{ padding: "1em", marginTop: "1em", width: "100%" }}>
      <Slider
        onChange={handleSliderChange}
        valueLabelDisplay="on"
        marks={marks}
        max={isTime ? secondsToTime : 255}
        sx={{
          "& .MuiSlider-thumb": {
            color: color,
          },
          "& .MuiSlider-track": {
            color: color,
          },
          "& .MuiSlider-rail": {
            color: "#acc4e4",
          },
          "& .MuiSlider-active": {
            color: "green",
          },
        }}
        value={typeof value === "number" ? value : 0}
        aria-label="Disabled slider"
      />
    </Box>
  );
};

export const CardConfigTab = (props: CardConfigTabProps) => {
  const { sendFormDataServer, card } = props;
  const [cardForm, setCarForm] = useState({
    pwm: card.pwm,
    timeCalibration: card.timeCalibration,
  });

  const onChangeBinaryValue = () => {
    if (cardForm.pwm > 0) {
      console.log("here")

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

  const sendFormData = () => {
    sendFormDataServer(cardForm, card.id);
  };
console.log(cardForm)
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
                {" "}
                PAUSE{" "}
                <IcoWaterOff className="buttonsvg" style={{ fill: "black" }} />
              </>
            ) : (
              <>
                {" "}
                ON{" "}
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
          {"PWM:"}
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
            onClick={sendFormData}
          >
            {"set"}
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
};
