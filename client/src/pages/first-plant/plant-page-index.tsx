import { SetStateAction, useEffect, useState } from "react";
import { plantaService } from "../../services/PlantaController.service";
import "./style.sass";
import { ReactComponent as IcoWaterOn } from "./../../icons/waterOn.svg";
import { ReactComponent as IcoWaterOff } from "./../../icons/waterOff.svg";
import { ReactComponent as IcoConf } from "./../../icons/conf.svg";
import { ReactComponent as IcoClock } from "./../../icons/clock.svg";

import { Days } from "../../components/Days/Days";
import { Clock } from "../../components/Clock/Clock";

import { Task } from "../../components/Task/Task";

import cloneDeep from "lodash/cloneDeep";
import { Alert, Box, Modal, Typography } from "@mui/material";

import { ModalConfig } from "./modal-config";

export const Plant = (props: any) => {
  const [stateWaterPump, setstateWaterPump] = useState("OFF");
  const [isOpenModalConfig, setIsOpenModalConfig] = useState(false);
  const [clock, setclock] = useState(undefined);
  const [temperature, settemperature] = useState(undefined);
  const [errorCreateTask, setErrorCreateTask] = useState((<></>) as any);

  const [errorGet, setErrorGet] = useState(undefined as string | undefined);

  const [days, setdays] = useState([
    { name: "L", state: false },
    { name: "Ma", state: false },
    { name: "Mi", state: false },
    { name: "Ju", state: false },
    { name: "V", state: false },
    { name: "S", state: false },
    { name: "D", state: false },
  ]);
  const [listTasks, setlistTasks] = useState([] as any);

  const hour = 17;
  const minutes = 30;

  const [dataforNewTask, setdataforNewTask] = useState({
    days: days,
    hour: 17,
    minutes: 30,
  });

  useEffect(() => {
    (async () => {
      try {
        const listData = await plantaService.getList();
        if (!listData.ok) {
          throw new Error("error getting list from server");
        }
        const listDataSplit = listData.split("/");
        const clockData = await plantaService.getClock();

        if (!clockData.ok) {
          throw new Error("error getting clock from server");
        }
        const temperatureData = await plantaService.getTemperature();
        settemperature(temperatureData);

        if (!temperatureData.ok) {
          throw new Error("error getting temp from server");
        }
        setclock(clockData);

        let ListFilteredEmpty: any = [];
        let ListEqualsDays: any = [];

        listDataSplit.forEach((element: any) => {
          const listDataSplitChild = element.split("-");

          const data = {
            day: listDataSplitChild[0],
            hour: listDataSplitChild[1],
            minutes: listDataSplitChild[2],
          };
          if (data?.day !== "") {
            ListFilteredEmpty.push(data);
          }
        });
        let ListFilteredEmptyOrdened = ListFilteredEmpty.sort(
          (a: any, b: any) => a.day.localeCompare(b.day)
        );

        for (let i = 0; i < ListFilteredEmptyOrdened.length; i++) {
          if (
            ListFilteredEmptyOrdened[i]?.day !==
              ListFilteredEmptyOrdened[i + 1]?.day ||
            ListFilteredEmptyOrdened[i]?.hour +
              ListFilteredEmptyOrdened[i]?.minutes !==
              ListFilteredEmptyOrdened[i + 1]?.hour +
                ListFilteredEmptyOrdened[i + 1]?.minutes
          ) {
            ListEqualsDays.push(ListFilteredEmpty[i]);
          }
        }

        let dataHelp = [];

        for (let i = 0; i < ListEqualsDays.length; i++) {
          for (let j = 0; j < ListEqualsDays.length; j++) {
            const hourCompare =
              ListEqualsDays[j].hour + ListEqualsDays[j].minutes;
            if (
              hourCompare !==
              ListEqualsDays[i].hour + ListEqualsDays[i].minutes
            ) {
              let exist = false;
              dataHelp.forEach((element) => {
                if (
                  element.hour + element.minutes ===
                  ListEqualsDays[i].hour + ListEqualsDays[i].minutes
                ) {
                  exist = true;
                }
              });

              if (!exist) {
                const n = {
                  days: [
                    {
                      name: getDayLetterWeek(ListEqualsDays[i].day),
                      state: true,
                    },
                  ],
                  hour: ListEqualsDays[i].hour,
                  minutes: ListEqualsDays[i].minutes,
                };
                dataHelp.push(n);
              }
            } else {
              dataHelp.forEach((element) => {
                if (
                  element.hour + element.minutes ===
                  ListEqualsDays[i].hour + ListEqualsDays[i].minutes
                ) {
                  let exist = false;
                  element.days.forEach((element) => {
                    if (
                      element.name === getDayLetterWeek(ListEqualsDays[i].day)
                    ) {
                      exist = true;
                    }
                  });

                  if (!exist) {
                    let newadd = {
                      name: getDayLetterWeek(ListEqualsDays[i].day),
                      state: true,
                    };

                    element.days = [...element.days, newadd];
                  }
                }
              });
            }
          }
        }

        if (dataHelp.length > 0) {
          setlistTasks(dataHelp);
        }
      } catch (error) {
        setErrorGet(`Error: ${error}`);
      }
    })();
  }, []);

  function getDayLetterWeek(dayTmp: any) {
    let letter = "";
    if (dayTmp === "Lunes") {
      letter = "L";
    }
    if (dayTmp === "Martes") {
      letter = "Ma";
    }
    if (dayTmp === "Miercoles") {
      letter = "Mi";
    }
    if (dayTmp === "Jueves") {
      letter = "J";
    }
    if (dayTmp === "Viernes") {
      letter = "V";
    }
    if (dayTmp === "Sabado") {
      letter = "S";
    }
    if (dayTmp === "Domingo") {
      letter = "D";
    }
    return letter;
  }

  function saveDays(value: any, index: any) {
    days[index].state = !days[index].state;
    setdays(days);
  }

  function createTask() {
    let exist = false;

    days.forEach((day) => {
      if (day?.state === true) {
        exist = true;
      }
    });
    if (exist) {
      setlistTasks([...listTasks, cloneDeep(dataforNewTask)]);
      setErrorCreateTask(undefined);

      (async () => {
        try {
          await plantaService.postaddTaskEsp(
            dataforNewTask.hour,
            dataforNewTask.minutes,
            JSON.stringify(dataforNewTask.days)
          );
        } catch (error) {}
      })();
    } else {
      setErrorCreateTask(
        <div className="error_plant">Selecciona un día o varios</div>
      );
    }
  }

  function saveTimeSelect(hour: any, minutes: any) {
    dataforNewTask.hour = hour;
    dataforNewTask.minutes = minutes;

    setdataforNewTask(dataforNewTask);
  }

  function eliminateTask(index: any) {
    const dataCopy = listTasks.slice();
    dataCopy.splice(index, 1);

    setlistTasks(dataCopy);
  }

  return (
    <>
      <div className="pagePlant">
        {errorGet && <Alert severity="error">{errorGet}</Alert>}
        <div className="principalCards_plant">
          <div className="cardPlantaf">
            <div className="cardPlanta">
              <div className="cardPlantac">
                <div className="title_plant">Planta</div>
                {clock ? (
                  <>
                    <div className="clockPlanta" id="temp">
                      {temperature} °C
                    </div>
                    <div className="clockPlanta" id="clock">
                      {clock}
                    </div>
                  </>
                ) : (
                  <>
                    <div className="clockPlanta">Sin conexión</div>
                  </>
                )}
              </div>

              <div className="cardPlantac22">
                <div>{stateWaterPump}</div>
                <div>
                  {stateWaterPump === "ON" ? (
                    <IcoWaterOn className="buttonsvg" />
                  ) : (
                    <IcoWaterOff className="buttonsvg" />
                  )}
                </div>
              </div>
            </div>
          </div>
          <div className="cardPlantaf">
            <div className="cardPlanta">
              <div className="cardPlantac">
                <div className="subtitle_plant">
                  <div>
                    <IcoClock className="buttonsvg2" />
                  </div>
                  <div>Tareas Programadas:</div>
                </div>
              </div>
              {listTasks.length > 0 && <>Total {listTasks.length}</>}
              <div
                className="cardPlantac2 tasksList_plant"
                data-testid={"listsTasks"}
              >
                {listTasks.length > 0 ? (
                  <>
                    {listTasks?.map((taskData: any, index: number) => (
                      <Task
                        taskData={taskData}
                        index={index}
                        key={index}
                        eliminateTask={eliminateTask}
                      />
                    ))}
                  </>
                ) : (
                  "No tienes ninguna tarea todavía"
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="cardNewTask_plantf">
          <div className="cardNewTask_plant">
            <Days saveDays={saveDays} days={days} />
            <div className="titleClock50">
              <Clock
                saveTimeSelect={saveTimeSelect}
                hour={hour}
                minutes={minutes}
              />

              <div className="button_plantf">
                <div className="button_plantf2">
                  Nuevo Riego a las 17:30 los Lunes y Martes
                  <IcoConf
                    className="buttonsvg"
                    onClick={() => setIsOpenModalConfig(!isOpenModalConfig)}
                  />
                </div>
                <div className="button_plantf2">
                  <div className="button_plant" onClick={(e) => createTask()}>
                    Añade este riego
                  </div>
                </div>
                {errorCreateTask}
              </div>
            </div>
          </div>
        </div>
      </div>
      <ModalConfig
        isOpenModalConfig={isOpenModalConfig}
        setIsOpenModalConfig={setIsOpenModalConfig}
        stateWaterPump={stateWaterPump}
        setstateWaterPump={setstateWaterPump}
      />
    </>
  );
};
