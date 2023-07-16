import axios from "axios";
import qs from "qs";
import {
  directionWeb,
  getRequestOptions,
  handleResponse,
} from "./PlantaController.service";
export const controlService = {
  postControlCocktailMachine,
  postControlCocktailMachine2,
};
//https://www.luisllamas.es/esp8266-servidor-parametros/
export interface PostControlCocktailMachineInterface {
  direction: string;
}

async function postControlCocktailMachine(
  data: PostControlCocktailMachineInterface
) {
  const params = qs.stringify(data);
  try {
    const response = await axios
    .get(
      `${directionWeb}/control?${params}`, 
      getRequestOptions("GET")
    );

    return response;
  } catch (error) {
    console.log("error", error);
    return error;
  }
}

function postControlCocktailMachine2(
  data: PostControlCocktailMachineInterface
) {
  return axios
    .post(`${directionWeb}/control`, data, getRequestOptions("POST"))
    .then(handleResponse)
    .then((response) => {
      console.log("response", response);
      return response;
    });
}
