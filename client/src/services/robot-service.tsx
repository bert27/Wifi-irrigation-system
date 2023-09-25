import axios from "axios";
import qs from "qs";
import { directionWeb, getRequestOptions } from "./PlantaController.service";
import { OutputDataInterface } from "../pages/car/components/card-outputs";
export const robotService = {
  sendDataColorToServer,sendDataOutputSelectedToServer
};
//https://www.luisllamas.es/esp8266-servidor-parametros/
export interface sendDataColorToServerInterface {
  color: string;
}

async function sendDataColorToServer(
  data: sendDataColorToServerInterface
) {
  const params = qs.stringify(data);
  try {
    const response = await axios.get(
      `${directionWeb}/colorRobot?${params}`,
      getRequestOptions("GET")
    );

    return response.data;
  } catch (error) {
    console.log("error", error);
    return error;
  }
}


async function sendDataOutputSelectedToServer(
  outputSelected: OutputDataInterface
) {
  const params = qs.stringify(outputSelected);
  try {
    const response = await axios.get(
      `${directionWeb}/outputRobot?${params}`,
      getRequestOptions("GET")
    );

    return response.data;
  } catch (error) {
    console.log("error", error);
    return error;
  }
}