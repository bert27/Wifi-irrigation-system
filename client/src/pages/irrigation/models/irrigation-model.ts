import { Day } from "@/pages/irrigation/models/day.model";

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

export interface IIrrigationConfig {
  set?: boolean | string;
  pwm?: number;
  timeCalibration?: number;
  [key: string]: any;
}

export interface IAddTask {
  success?: boolean;
  message?: string;
  [key: string]: any;
}

export interface IResponseIrrigation {
  listTasks: IScheduledTask[];
  clock: string;
  temperature: ITemperature;
  waterPumpStatus: IWaterPumpStatus;
}

export interface IIrrigationData {
  waterPump1: boolean;
  temperature: number;
  humidity: number;
  tasks: IScheduledTask[];
}
