import { IWaterPumpStatus, ITemperature, IAddTask } from "../pages/plant/models/plant-model";
import axios, { AxiosResponse } from "axios";
import { directionWeb, handleResponse } from "../config/api.config";

const USE_MOCK = import.meta.env.VITE_MOCK_SERVER === 'true';

let mockState = {
    waterPump1: false,
    temperature: 24.5,
    humidity: 60,
    tasks: [
        { hour: "08", minutes: "30", days: ["Lunes", "Miercoles", "Viernes"] }
    ]
};

const mockDelay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const irrigationService = {
    getWaterPump1OnOFF: async (data?: any): Promise<IWaterPumpStatus> => {
        if (USE_MOCK) {
            await mockDelay(500);
            if (data?.set === true || data?.set === 'true') mockState.waterPump1 = true;
            if (data?.set === false || data?.set === 'false') mockState.waterPump1 = false;

            if (data?.pwm !== undefined || data?.timeCalibration !== undefined) {
                return { status: true };
            }

            return { status: mockState.waterPump1 };
        }
        const response = await axios.get(`${directionWeb}/waterPump1OnOFF`, { params: data });
        const resData = handleResponse(response);
        let status = false;
        if (typeof resData === 'string') {
            if (resData === "ON" || resData === "OK") status = true;
        } else if (typeof resData === 'object' && resData.status !== undefined) {
            status = !!resData.status;
        }
        return { status };
    },

    getList: async (): Promise<string> => {
        if (USE_MOCK) {
            await mockDelay(500);
            const formattedTasks = mockState.tasks.flatMap(task =>
                task.days.map(day => `${day}-${task.hour}-${task.minutes}`)
            ).join('/');
            return formattedTasks;
        }
        const response = await axios.get(`${directionWeb}/getList`);
        const data = handleResponse(response);
        if (Array.isArray(data)) {
            return data.flatMap((t: any) =>
                (Array.isArray(t.days) ? t.days : [t.days]).map((d: string) => `${d}-${t.hour}-${t.minutes}`)
            ).join('/');
        }
        return String(data);
    },

    postaddTaskEsp: async (hour: string | number, minutes: string | number, days: string): Promise<IAddTask> => {
        if (USE_MOCK) {
            await mockDelay(500);
            const newDays = typeof days === 'string' ? days.split(',') : days;
            mockState.tasks.push({ hour: String(hour), minutes: String(minutes), days: newDays as any });
            return { success: true, message: "Task added (Mock)" };
        }
        const response = await axios.get(`${directionWeb}/addTaskEsp`, {
            params: { hour, minutes, days }
        });
        return handleResponse(response);
    },

    getTemperature: async (): Promise<ITemperature> => {
        if (USE_MOCK) {
            await mockDelay(500);
            mockState.temperature += (Math.random() - 0.5) * 0.5;
            return {
                temperature: mockState.temperature.toFixed(1),
                humidity: mockState.humidity
            };
        }
        const response = await axios.get(`${directionWeb}/getTemperature`);
        return handleResponse(response);
    },

    getClock: async (): Promise<string> => {
        if (USE_MOCK) {
            await mockDelay(500);
            const now = new Date();
            return now.toLocaleTimeString();
        }
        const response = await axios.get(`${directionWeb}/getClock`);
        return handleResponse(response);
    }
};
