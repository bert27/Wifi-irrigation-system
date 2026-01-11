#pragma once

#include <ESPAsyncWebServer.h>
#include "../controller.hpp"

// Forward declaration of IrrigationSystem to avoid circular include issues if not using Singleton directly
// However, since we use the singleton instance 'irrigationSystem', we just need the header.

void getRoot(AsyncWebServerRequest *request) {
    request->send(200, "text/plain", "Servidor robot");
}

void waterPump1OnOFF(AsyncWebServerRequest *request) {
    irrigationSystem.handlePumpControl(request);
}

void getClock(AsyncWebServerRequest *request) {
     request->send(200, "text/plain", irrigationSystem.getClockString());
}

void getList(AsyncWebServerRequest *request) {
    irrigationSystem.handleGetList(request);
}

void getTemperature(AsyncWebServerRequest *request) {
     irrigationSystem.handleGetTemperature(request);
}

void addTaskEsp(AsyncWebServerRequest *request) {
    irrigationSystem.handleAddTask(request);
}

void setupPlantAPI(AsyncWebServer& server) {
    server.on("/", HTTP_GET, getRoot);
    server.on("/waterPump1OnOFF", HTTP_GET, waterPump1OnOFF);
    server.on("/getClock", HTTP_GET, getClock);
    server.on("/getList", HTTP_GET, getList);
    server.on("/getTemperature", HTTP_GET, getTemperature);
    server.on("/addTaskEsp", HTTP_GET, addTaskEsp);
}
