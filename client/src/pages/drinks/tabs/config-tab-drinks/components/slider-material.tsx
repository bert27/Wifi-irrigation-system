import { Box, Slider } from "@mui/material";
import { useEffect, useState } from "react";
import { color } from "../card-config-tab";

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
