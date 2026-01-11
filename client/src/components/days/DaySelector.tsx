import React, { useState } from "react";
import "./days.css";
import CheckIcon from "@mui/icons-material/Check";
import { Day } from "./models/day.model";

interface DaySelectorProps {
  day: Day;
  saveChoose: (day: Day, index: number) => void;
  index: number;
}

export const DaySelector: React.FC<DaySelectorProps> = ({ day, saveChoose, index }) => {
  const [isActive, setIsActive] = useState(false);

  const toggleDay = () => {
    setIsActive(!isActive);
    saveChoose(day, index);
  };

  return (
    <div 
      className={`days_plant_child ${isActive ? 'active' : ''}`} 
      onClick={toggleDay}
    >
      <div>{day?.name}</div>
      <div className="checkBox_plant_child">
        {isActive && <CheckIcon className="buttonsvg" />}
      </div>
    </div>
  );
};
