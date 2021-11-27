import React, { useCallback } from "react";
import Slider from "rc-slider";
import "./Slider.sass";
import "rc-slider/assets/index.css";
import PropTypes from "prop-types";

export const SliderC = (props) => {
  const { value, onChange, enabled, WarningMessage, size, ...parsedProps } =
    props;

  const actionOnSliderChange = useCallback(
    (value) => {
      if (enabled) {
        onChange(value);
      } else {
        if (WarningMessage !== undefined) {
          WarningMessage();
        }
      }
    },
    [onChange, enabled, WarningMessage]
  );

  return (
    <>
      <div className={"rangeSliderWrap"}>
        <>
          <Slider
            onChange={(value) => {
              actionOnSliderChange(value);
            }}
            value={[value]}
            style={enabled ? {} : { backgroundColor: "grey" }}
            className={"type" + size}
            {...parsedProps}
          />
        </>
      </div>
    </>
  );
};

SliderC.propTypes = {
  value: PropTypes.number.isRequired,
  max: PropTypes.number,
  min: PropTypes.number,
  onChange: PropTypes.func.isRequired,
};
