import { useState, useEffect, useRef } from "react";
import { irrigationService } from "../../../services/irrigation.service";
import { Day } from "../../../components/days/models/day.model";
import { IScheduledTask, ITemperature } from "../models/plant-model";

const getDayLetterWeek = (dayTmp: string): string => {
  const mapping: Record<string, string> = {
    "Lunes": "L", "Martes": "Ma", "Miercoles": "Mi", "Jueves": "J",
    "Viernes": "V", "Sabado": "S", "Domingo": "D"
  };
  return mapping[dayTmp] || dayTmp;
};

const withTimeout = <T,>(promise: Promise<T>, timeoutMs: number = 10000): Promise<T> => {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) =>
      setTimeout(() => reject(new Error('Request timeout')), timeoutMs)
    )
  ]);
};

import { useTranslation } from "react-i18next";

export const usePlantPage = () => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(true);
  const [stateWaterPump, setStateWaterPump] = useState<boolean>(false);
  const [clock, setClock] = useState<string | null>(null);
  const [temperature, setTemperature] = useState<number | null>(null);
  const [errorCreateTask, setErrorCreateTask] = useState<string | null>(null);
  const [errorGet, setErrorGet] = useState<string | null>(null);
  const [isOpenModalConfig, setIsOpenModalConfig] = useState(false);

  const [days, setDays] = useState<Day[]>([
    { name: "L", state: false },
    { name: "Ma", state: false },
    { name: "Mi", state: false },
    { name: "Ju", state: false },
    { name: "V", state: false },
    { name: "S", state: false },
    { name: "D", state: false },
  ]);

  const [listTasks, setListTasks] = useState<IScheduledTask[]>([]);

  const [dataForNewTask, setDataForNewTask] = useState<IScheduledTask>({
    days: [],
    hour: "17",
    minutes: "30",
  });

  const isMounted = useRef(true);

  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);

  useEffect(() => {
    console.log('🎯 useEffect triggered, calling fetchData');

    const fetchData = async () => {
      console.log('🔄 fetchData called');
      try {
        const listData = await withTimeout(irrigationService.getList());
        const clockData = await withTimeout(irrigationService.getClock());
        const temperatureData = await withTimeout(irrigationService.getTemperature());

        setClock(clockData);
        setTemperature(Number(temperatureData.temperature));

        if (listData && typeof listData === 'string') {
          const listDataSplit = listData.split("/");
          const parsedTasks: IScheduledTask[] = [];

          const tempMap = new Map<string, Day[]>();

          listDataSplit.forEach((element: string) => {
            const parts = element.split("-");
            if (parts.length === 3) {
              const [dayStr, h, m] = parts;
              const timeKey = `${h}:${m}`;
              const currentDays = tempMap.get(timeKey) || [];
              currentDays.push({ name: getDayLetterWeek(dayStr), state: true });
              tempMap.set(timeKey, currentDays);
            }
          });

          tempMap.forEach((daysList, timeKey) => {
            const [h, m] = timeKey.split(":");
            parsedTasks.push({ days: daysList, hour: h, minutes: m });
          });

          setListTasks(parsedTasks);
        }
      } catch (error) {
        setErrorGet(`${t('plant.errors.connection')}: ${error}`);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const saveDays = (clickedDay: Day, index: number) => {
    const newDays = [...days];
    newDays[index] = { ...newDays[index], state: !newDays[index].state };
    setDays(newDays);
    setDataForNewTask(prev => ({ ...prev, days: newDays.filter(d => d.state) }));
  };

  const saveTimeSelect = (h: string, m: string) => {
    setDataForNewTask(prev => ({ ...prev, hour: h, minutes: m }));
  };

  const createTask = async () => {
    const selectedDays = days.filter(d => d.state);
    if (selectedDays.length === 0) {
      setErrorCreateTask(t('plant.errors.noDaySelected'));
      return;
    }

    try {
      setListTasks(prev => [...prev, { ...dataForNewTask, days: selectedDays }]);
      setErrorCreateTask(null);
      await irrigationService.postaddTaskEsp(
        dataForNewTask.hour,
        dataForNewTask.minutes,
        JSON.stringify(selectedDays.map(d => d.name))
      );
    } catch (error) {
      setErrorCreateTask(t('plant.errors.saveFailed'));
    }
  };



  const eliminateTask = (index: number) => {
    setListTasks(prev => prev.filter((_, i) => i !== index));
  };

  return {
    loading,
    stateWaterPump,
    setStateWaterPump,
    clock,
    temperature,
    errorCreateTask,
    errorGet,
    listTasks,
    days,
    dataForNewTask,
    isOpenModalConfig,
    setIsOpenModalConfig,

    saveDays,
    saveTimeSelect,
    createTask,
    eliminateTask
  };
};
