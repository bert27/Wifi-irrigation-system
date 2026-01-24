import React, { useCallback } from "react";
import Slider from "rc-slider";
import "./Slider.css";
import "rc-slider/assets/index.css";

export interface SliderProps {
  value: number;
  onChange: (value: number | number[]) => void;
  enabled: boolean;
  WarningMessage?: () => void;
  max?: number;
  min?: number;
  size?: string;
  step?: number;
}


export const SliderC: React.FC<SliderProps> = ({
  value,
  onChange,
  enabled,
  WarningMessage,
  size,
  ...parsedProps
}) => {
  const actionOnSliderChange = useCallback(
    (val: number | number[]) => {
      if (enabled) {
        onChange(val);
      } else {
        if (WarningMessage !== undefined) {
          WarningMessage();
        }
      }
    },
    [onChange, enabled, WarningMessage]
  );

  return (
    <div className="rangeSliderWrap">
      <Slider
        onChange={actionOnSliderChange}
        value={value}
        style={enabled ? {} : { opacity: 0.5, pointerEvents: 'none' }}
        className={`type-${size}`}
        {...parsedProps}
      />
    </div>
  );
};
