import axios from "axios";
import { IColorData } from "@/pages/car/models/model";
import { directionWebRobot } from "@/config/api.config";
import { OutputDataInterface } from "@/pages/car/components/card-outputs";
import { ColumnInterface } from "@/pages/car/components/table-outputs";
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

  sendDataOutputSelectedToServer: async (outputSelected: OutputDataInterface) => {
    return await axiosGet(outputSelected, "outputRobot");
  },

  sendRowTableOutputsMotors: async (rowSelected: ColumnInterface) => {
    return await axiosGet(rowSelected, "outputsRowTableRobot");
  },

  sendRowTableOutputsStatusUpdate: async (rowSelected: ColumnInterface) => {
    return await axiosGet(rowSelected, "outputsRowTableRobotUpdate");
  },

  sendOutputRobotUI: async (data: { name: string }) => {
    return await axiosGet(data, "outputRobotUI");
  },
};
