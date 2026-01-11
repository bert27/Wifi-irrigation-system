#include <ESPAsyncWebServer.h>
#include <ArduinoJson.h>
#include "../controller.hpp"

void changeColor(AsyncWebServerRequest *request) {
    String color = "unknown";
    if (request->hasParam("color")) {
        color = request->getParam("color")->value();
        CarController::getInstance().changeColor(color);
    }
    request->send(200, "text/plain", "Color changed to " + color);
}

void toggleLED(AsyncWebServerRequest *request) {
    CarController::getInstance().toggleLED();
    request->send(200, "text/plain", "LED Toggled");
}

void outputRobot(AsyncWebServerRequest *request) {
    CarController::getInstance().setOutputRobot();
    request->send(200, "text/plain", "Output Robot OK");
}

void outputsRowTableRobot(AsyncWebServerRequest *request) {
    CarController::getInstance().setRowTableOutputs();
    request->send(200, "text/plain", "Row Table OK");
}

void outputRobotUI(AsyncWebServerRequest *request) {
    String name = "unknown";
    if (request->hasParam("name")) {
        name = request->getParam("name")->value();
        CarController::getInstance().setOutputRobotUI(name);
    }
    request->send(200, "text/plain", "Output UI OK");
}

void setupCarAPI(AsyncWebServer& server) {
    server.on("/changeColor", HTTP_GET, changeColor);
    server.on("/toggleLED", HTTP_GET, toggleLED);
    server.on("/outputRobot", HTTP_GET, outputRobot);
    server.on("/outputsRowTableRobot", HTTP_GET, outputsRowTableRobot);
    server.on("/outputRobotUI", HTTP_GET, outputRobotUI);
}
