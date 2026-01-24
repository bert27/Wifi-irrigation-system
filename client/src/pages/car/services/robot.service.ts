import axios from "axios";
import { IColorData, IOutputData } from "@/pages/car/models/model";
import { directionWebRobot } from "@/services/api.service";
import { activateReactiveSimulation, isSimulationMode } from "@/utils/simulation";

const USE_MOCK = isSimulationMode();

const axiosGet = async (params: Record<string, any> | undefined, endpoint: string) => {
  if (USE_MOCK) return { success: true };
  try {
    const response = await axios.get(`${directionWebRobot}/${endpoint}`, {
      params,
    });
    return response.data;
  } catch (error) {
    const err = error as Error & { response?: { data?: any } };
    console.error(`Robot service error on ${endpoint}:`, err);
    activateReactiveSimulation();
    const errorMessage = err.message ?? "Unknown error";
    return { type: "error", message: errorMessage };
  }
};

export const robotService = {
  sendDataColorToServer: async (data: IColorData) => {
    return await axiosGet({ color: data.color }, "changeColor");
  },

  toggleLED: async () => {
    if (USE_MOCK) return { success: true };
    try {
      const response = await axios.get(`${directionWebRobot}/toggleLED`);
      return response.data;
    } catch (error) {
      console.error("Robot toggleLED error:", error);
      activateReactiveSimulation();
      throw error;
    }
  },

  sendDataOutputSelectedToServer: async (outputSelected: IOutputData) => {
    return await axiosGet(outputSelected, "outputRobot");
  },

  sendOutputRobotUI: async (data: { name: string }) => {
    return await axiosGet(data, "outputRobotUI");
  },
};
