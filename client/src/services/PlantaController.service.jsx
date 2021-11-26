import axios from "axios";

export const plantaService = {
  getdata,
  postTurnOff,
  getClock,
  getTemperature,
  postaddTaskEsp,
  getList,
};
function getList(data) {
  return axios
    .get(`http://192.168.1.200:80/getList`, data, getRequestOptions("GET"))
    .then(handleResponse)
    .then((response) => {
      return response;
    });
}
function postaddTaskEsp(hour, minutes, days) {
  return axios
    .get(
      `http://192.168.1.200:80/addTaskEsp?hour=${hour}&minutes=${minutes}&days=${days}`,

      getRequestOptions("GET")
    )
    .then(handleResponse)
    .then((response) => {
      return response;
    });
}
function getTemperature(data) {
  return axios
    .get(
      `http://192.168.1.200:80/getTemperature`,
      data,
      getRequestOptions("GET")
    )
    .then(handleResponse)
    .then((response) => {
      return response;
    });
}
function getClock(data) {
  return axios
    .get(`http://192.168.1.200:80/getClock`, data, getRequestOptions("GET"))
    .then(handleResponse)
    .then((response) => {
      return response;
    });
}
//agrega mensaje nuevo en hilo
function postTurnOff(data) {
  return axios
    .get(`http://192.168.1.200:80/turnOff`, data, getRequestOptions("GET"))
    .then(handleResponse)
    .then((response) => {
      return response;
    });
}
function getdata(data) {
  return axios
    .get(`http://192.168.1.200:80/datos`, data, getRequestOptions("GET"))
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
