import axios from "axios";
import qs from "qs";
import { directionWeb, getRequestOptions } from "./PlantaController.service";
export const robotService = {
  sendDataColorToServer,
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

    return response;
  } catch (error) {
    console.log("error", error);
    return error;
  }
}
