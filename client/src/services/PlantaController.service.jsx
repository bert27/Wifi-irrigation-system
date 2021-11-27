import axios from "axios";

export const plantaService = {
  getdata,
  getList,
  getClock,
  getTemperature,
  postaddTaskEsp,
  postTurnOff,
};

const directionWeb = process.env.REACT_APP_API_DIR;

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
//agrega mensaje nuevo en hilo
function postTurnOff(data) {
  return axios
    .get(`${directionWeb}/turnOff`, data, getRequestOptions("GET"))
    .then(handleResponse)
    .then((response) => {
      return response;
    });
}
function getdata(data) {
  return axios
    .get(`${directionWeb}/datos`, data, getRequestOptions("GET"))
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
