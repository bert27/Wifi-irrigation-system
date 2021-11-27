import { useEffect, useState } from "react";
import { SliderC } from "../Slider/Slider";
import "./style.sass";

export const Clock = (props) => {
  const { saveTimeSelect, hour, minutes } = props;
  const maxHours = 23;

  const minMinutes = 0;
  const WarningMessage = "Peligro";

  const [hora, sethora] = useState(hour);
  const [minutos, setminutos] = useState(minutes);

  useEffect(() => {
    saveTimeSelect(hora, minutos);
  }, [hora, minutos]);
  function SliderMinutes(value) {
    let minutes = value;

    if (minutes.toString().length === 1) {
      minutes = "0" + minutes.toString();
    }
    setminutos(minutes);
  }
  function SliderHour(value) {
    let hour = value;
    let minutes = minutos;

    if (hour.toString().length === 1) {
      hour = "0" + hour.toString();
    }
    if (minutes.toString().length === 1) {
      minutes = "0" + minutes.toString();
    }
    sethora(hour);
    setminutos(minutes);
  }

  function getMinutesMax() {
    return 59;
  }
  return (
    <div className="DataPickerV2">
      <div className="HourDisplayFather">
        <div className="HoursDisplay">
          <div className="hourpicker">
            <div className="fixheightHour">{hora}</div>
          </div>
          <div className="Title_Descripction separatorClock">:</div>
          <div className="hourpicker">
            <div className="fixheightHour">{minutos}</div>
          </div>
        </div>
      </div>

      <div className="HoursDisplay2 column">
        <div className="Title_Descripction TitleClock">Horas:</div>

        <SliderC
          onChange={SliderHour}
          value={parseInt(hora)}
          max={maxHours}
          enabled={true}
          WarningMessage={WarningMessage}
          min={minMinutes}
        />

        <div className="Title_Descripction TitleClock">Minutos: </div>
        <SliderC
          onChange={SliderMinutes}
          value={parseInt(minutos)}
          max={getMinutesMax()}
          enabled={true}
          WarningMessage={WarningMessage}
          min={0}
        />
      </div>
    </div>
  );
};
