import { useState } from "react";
import "./style.sass";
import { ReactComponent as IcoCheck } from "./../icons/check.svg";

export const DaySelector = (props) => {
  const { day, saveChoose, index } = props;
  const [activateDay, setactivateDay] = useState(false);
  function activeDay() {
    setactivateDay(!activateDay);
    saveChoose(day, index);
  }

  return (
    <div className="days_plant_child" onClick={activeDay}>
      <div>{day?.name}</div>
      <div className="checkBox_plant_child">
        {activateDay && <IcoCheck className="buttonsvg" />}
      </div>
    </div>
  );
};
