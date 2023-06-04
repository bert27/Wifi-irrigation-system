import axios from "axios";
import qs from "qs";
export const plantaService = {
  getList,
  getClock,
  getTemperature,
  postaddTaskEsp,
  getWaterPump1OnOFF,
};

const directionWeb = process.env.REACT_APP_API_DIR;

function getWaterPump1OnOFF(data) {
  const params = qs.stringify(data);
  return axios
    .get(`${directionWeb}/waterPump1OnOFF?${params}`)
    .then(handleResponse)
    .then((response) => {
      return response;
    });
}

function getList(data) {
  return axios
    .get(`${directionWeb}/getList`, data, getRequestOptions("GET"))
    .then(handleResponse)
    .then((response) => {
      return response;
    });
}
function postaddTaskEsp(hour, minutes, days) {
  return axios
    .get(
      `${directionWeb}/addTaskEsp?hour=${hour}&minutes=${minutes}&days=${days}`,

      getRequestOptions("GET")
    )
    .then(handleResponse)
    .then((response) => {
      return response;
    });
}
function getTemperature(data) {
  return axios
    .get(`${directionWeb}/getTemperature`, data, getRequestOptions("GET"))
    .then(handleResponse)
    .then((response) => {
      return response;
    });
}
function getClock(data) {
  return axios
    .get(`${directionWeb}/getClock`, data, getRequestOptions("GET"))
    .then(handleResponse)
    .then((response) => {
      return response;
    });
}

//---------------------AUX---
function getRequestOptions(method) {
  return {
    method: method,
    headers: {
      "Content-Type": "application/json",
    },
  };
}

function handleResponse(response) {
  var p = new Promise((resolve, reject) => {
    const data = response.data;
    if (response.status >= 400) {
      /*if (response.status === 401) {
          history.push(routesConstants.sign.OUT);
        }*/

      const error = response.statusText;
      reject(error);
    }

    resolve(data);
  });
  return p.then((data) => {
    return data;
  });
}
