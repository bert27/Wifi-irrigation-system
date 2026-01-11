import { Day } from "../../../components/days/models/day.model";

export interface IScheduledTask {
  days: Day[];
  hour: string;
  minutes: string;
}

export interface IWaterPumpStatus {
  status: boolean;
}

export interface ITemperature {
  temperature: string | number;
  humidity: string | number;
}

export interface IAddTask {
  success?: boolean;
  message?: string;
  [key: string]: any;
}

export interface IResponsePlant {
  listTasks: IScheduledTask[];
  clock: string;
  temperature: ITemperature;
  waterPumpStatus: IWaterPumpStatus;
}
