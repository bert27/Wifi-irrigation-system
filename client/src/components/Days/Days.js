import { DaySelector } from "./DaySelector";
export const Days = (props) => {
  const { saveDays, days } = props;

  return (
    <div className="days_plant">
      {days.map((day, index) => (
        <DaySelector
          day={day}
          saveChoose={saveDays}
          index={index}
          key={index}
        />
      ))}
    </div>
  );
};
