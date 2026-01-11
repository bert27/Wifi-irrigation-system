import React from "react";
import { DaySelector } from "./DaySelector";
import { Day } from "./models/day.model";

interface DaysProps {
  saveDays: (day: Day, index: number) => void;
  days: Day[];
}

export const Days: React.FC<DaysProps> = ({ saveDays, days }) => {
  return (
    <div className="days_plant">
      {days.map((day, index) => (
        <DaySelector
          day={day}
          saveChoose={saveDays}
          index={index}
          key={day.name + index}
        />
      ))}
    </div>
  );
};
