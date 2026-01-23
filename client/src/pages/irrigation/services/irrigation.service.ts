import { IWaterPumpStatus, ITemperature, IAddTask, IIrrigationConfig, IIrrigationData } from "@/pages/irrigation/models/irrigation-model";
import axios from "axios";
import { directionWebIrrigation, handleResponse } from "@/config/api.config";
import { activateReactiveSimulation, isSimulationMode } from "@/utils/simulation";

const USE_MOCK = isSimulationMode();


const mockState: IIrrigationData = {
    waterPump1: false,
    temperature: 24.5,
    humidity: 60,
    tasks: [
        {
            hour: "08",
            minutes: "30",
            days: [
                { name: "Lunes", state: true },
                { name: "Miercoles", state: true },
                { name: "Viernes", state: true }
            ]
        }
    ]
};

const mockDelay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const irrigationService = {
    getWaterPump1OnOFF: async (data?: IIrrigationConfig): Promise<IWaterPumpStatus> => {
        if (USE_MOCK) {
            await mockDelay(500);
            if (data?.set === true || data?.set === 'true') mockState.waterPump1 = true;
            if (data?.set === false || data?.set === 'false') mockState.waterPump1 = false;

            if (data?.pwm !== undefined || data?.timeCalibration !== undefined) {
                return { status: true };
            }

            return { status: mockState.waterPump1 };
        }
        try {
            const response = await axios.get(`${directionWebIrrigation}/waterPump1OnOFF`, { params: data });
            const resData = handleResponse(response);
            let status = false;
            if (typeof resData === 'string') {
                if (resData === "ON" || resData === "OK") status = true;
            } else if (typeof resData === 'object' && resData.status !== undefined) {
                status = !!resData.status;
            }
            return { status };
        } catch (error) {
            console.error("Irrigation state error, triggering simulation mode:", error);
            activateReactiveSimulation();
            throw error;
        }
    },

    getList: async (): Promise<string> => {
        if (USE_MOCK) {
            await mockDelay(500);
            const formattedTasks = mockState.tasks.flatMap(task =>
                task.days.map(day => `${day.name}-${task.hour}-${task.minutes}`)
            ).join('/');
            return formattedTasks;
        }
        try {
            const response = await axios.get(`${directionWebIrrigation}/getList`);
            const data = handleResponse(response);
            if (Array.isArray(data)) {
                return data.flatMap((t: any) =>
                    (Array.isArray(t.days) ? t.days : [t.days]).map((d: string) => `${d}-${t.hour}-${t.minutes}`)
                ).join('/');
            }
            return String(data);
        } catch (error) {
            console.error("Irrigation getList error, triggering simulation mode:", error);
            activateReactiveSimulation();
            throw error;
        }
    },

    postaddTaskEsp: async (hour: string | number, minutes: string | number, days: string): Promise<IAddTask> => {
        if (USE_MOCK) {
            await mockDelay(500);
            const selectedDayNames = typeof days === 'string' ? JSON.parse(days) : days;
            const newDays = (selectedDayNames as string[]).map(name => ({ name, state: true }));

            mockState.tasks.push({
                hour: String(hour),
                minutes: String(minutes),
                days: newDays
            });
            return { success: true, message: "Task added (Mock)" };
        }
        try {
            const response = await axios.get(`${directionWebIrrigation}/addTaskEsp`, {
                params: { hour, minutes, days }
            });
            return handleResponse(response);
        } catch (error) {
            console.error("Irrigation addTask error, triggering simulation mode:", error);
            activateReactiveSimulation();
            throw error;
        }
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
        try {
            const response = await axios.get(`${directionWebIrrigation}/getTemperature`);
            return handleResponse(response);
        } catch (error) {
            console.error("Irrigation temperature error, triggering simulation mode:", error);
            activateReactiveSimulation();
            throw error;
        }
    },

    getClock: async (): Promise<string> => {
        if (USE_MOCK) {
            await mockDelay(500);
            const now = new Date();
            return now.toLocaleTimeString();
        }
        try {
            const response = await axios.get(`${directionWebIrrigation}/getClock`);
            return handleResponse(response);
        } catch (error) {
            console.error("Irrigation clock error, triggering simulation mode:", error);
            activateReactiveSimulation();
            throw error;
        }
    }
};
