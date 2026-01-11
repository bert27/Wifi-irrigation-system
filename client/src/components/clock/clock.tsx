import React, { useEffect, useState } from "react";
import { SliderC } from "./Slider/Slider";
import { ClockProps } from "./models/clock.model";
import "./clock.css";

export const Clock: React.FC<ClockProps> = ({ saveTimeSelect, hour, minutes }) => {
  const maxHours = 23;
  const minMinutes = 0;
  const WarningMessage = () => console.warn("Ajuste no permitido");

  const [localHora, setLocalHora] = useState(hour);
  const [localMinutos, setLocalMinutos] = useState(minutes);

  useEffect(() => {
    saveTimeSelect(localHora, localMinutos);
  }, [localHora, localMinutos]);

  const handleHourChange = (value: number | number[]) => {
    const val = Array.isArray(value) ? value[0] : value;
    const formatted = val.toString().padStart(2, '0');
    setLocalHora(formatted);
  };

  const handleMinutesChange = (value: number | number[]) => {
    const val = Array.isArray(value) ? value[0] : value;
    const formatted = val.toString().padStart(2, '0');
    setLocalMinutos(formatted);
  };

  return (
    <div className="DataPickerV2">
      <div className="HourDisplayFather">
        <div className="HoursDisplay">
          <div className="hourpicker">
            <div className="fixheightHour">{localHora}</div>
            <div className="TitleClock">Horas</div>
          </div>
          <div className="separatorClock">:</div>
          <div className="hourpicker">
            <div className="fixheightHour">{localMinutos}</div>
            <div className="TitleClock">Minutos</div>
          </div>
        </div>
      </div>

      <div className="HoursDisplay2">
        <SliderC
          onChange={handleHourChange}
          value={parseInt(localHora)}
          max={maxHours}
          enabled={true}
          WarningMessage={WarningMessage}
          min={minMinutes}
          step={1}
        />

        <SliderC
          onChange={handleMinutesChange}
          value={parseInt(localMinutos)}
          max={59}
          enabled={true}
          WarningMessage={WarningMessage}
          min={0}
          step={1}
        />
      </div>
    </div>
  );
};
