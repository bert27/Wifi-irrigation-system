import axios, { AxiosError } from "axios";
import qs from "qs";
import { directionWeb, getRequestOptions } from "./PlantaController.service";
import { OutputDataInterface } from "../pages/car/components/card-outputs";
import { ColumnInterface } from "../pages/car/components/table-outputs";
export const robotService = {
  sendDataColorToServer,
  sendDataOutputSelectedToServer,
  sendRowTableOutputsMotors,
};

interface ErrorResponseInterface {
  status: number;
  data?: any;
  message: string;
}

//https://www.luisllamas.es/esp8266-servidor-parametros/
export interface sendDataColorToServerInterface {
  color: string;
}

async function sendDataColorToServer(data: sendDataColorToServerInterface) {
  const params = qs.stringify(data);
  return await axiosGet(params, "colorRobot");
}

async function sendDataOutputSelectedToServer(
  outputSelected: OutputDataInterface
) {
  const params = qs.stringify(outputSelected);
  return await axiosGet(params, "outputRobot");
}

async function sendRowTableOutputsMotors(rowSelected: ColumnInterface) {
  const params = qs.stringify(rowSelected);
  return await axiosGet(params, "outputsRowTableRobot");
}

const axiosGet = async (params: string, direction: string) => {
  try {
    const response = await axios.get(
      `${directionWeb}/${direction}?${params}`,
      getRequestOptions("GET")
    );
    return response.data;
  } catch (error: any) {
    const errorMessage = error.message ?? "Unknown error";
    return { type: "error", message: errorMessage };
  }
};
