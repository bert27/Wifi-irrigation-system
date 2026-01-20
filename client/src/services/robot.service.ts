import axios from "axios";
import { IColorData } from "../pages/car/models/model";
import { directionWeb, getRequestOptions } from "../config/api.config";
import { OutputDataInterface } from "../pages/car/components/card-outputs";
import { ColumnInterface } from "../pages/car/components/table-outputs";

const axiosGet = async (params: any, endpoint: string) => {
  try {
    const response = await axios.get(`${directionWeb}/${endpoint}`, {
      params,
      ...getRequestOptions("GET"),
    });
    return response.data;
  } catch (error: any) {
    const errorMessage = error.message ?? "Unknown error";
    return { type: "error", message: errorMessage };
  }
};

export const robotService = {
  sendDataColorToServer: async (data: IColorData) => {
    return await axiosGet({ color: data.color }, "changeColor");
  },

  toggleLED: async () => {
    const response = await axios.get(`${directionWeb}/toggleLED`);
    return response.data;
  },

  sendDataOutputSelectedToServer: async (outputSelected: OutputDataInterface) => {
    return await axiosGet(outputSelected, "outputRobot");
  },

  sendRowTableOutputsMotors: async (rowSelected: ColumnInterface) => {
    return await axiosGet(rowSelected, "outputsRowTableRobot");
  },

  sendOutputRobotUI: async (data: { name: string }) => {
    return await axiosGet(data, "outputRobotUI");
  },
};
