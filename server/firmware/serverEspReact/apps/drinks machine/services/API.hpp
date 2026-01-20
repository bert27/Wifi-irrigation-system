#pragma once

#include <ESPAsyncWebServer.h>
#include "../controller.hpp"

void controlCocktail(AsyncWebServerRequest *request) {
    String direction = "No direction sent";
    if (request->hasParam("direction")) {
        direction = request->getParam("direction")->value();
        
        if (direction == "next" || direction == "down") {
            DrinksInputManager::getInstance().enqueueCommand("next");
        } else if (direction == "up") {
            DrinksInputManager::getInstance().enqueueCommand("prev");
        } else if (direction == "accept") {
            DrinksInputManager::getInstance().enqueueCommand("select");
        } else if (direction == "back") {
            DrinksInputManager::getInstance().enqueueCommand("back");
        } else if (direction == "cancel") {
            DrinksInputManager::getInstance().enqueueCommand("cancel");
        } else if (direction.startsWith("goto:")) {
            DrinksInputManager::getInstance().enqueueCommand(direction);
        } else if (direction.startsWith("pump:")) {
            DrinksInputManager::getInstance().enqueueCommand(direction);
        } else if (direction == "goto" && request->hasParam("index")) {
            String index = request->getParam("index")->value();
            DrinksInputManager::getInstance().enqueueCommand("goto:" + index);
        } else if (direction == "config" && request->hasParam("id") && request->hasParam("pwm") && request->hasParam("time")) {
            String id = request->getParam("id")->value();
            String pwm = request->getParam("pwm")->value();
            String time = request->getParam("time")->value();
            DrinksInputManager::getInstance().enqueueCommand("pump:" + id + ":" + pwm + ":" + time);
        }
    }
    request->send(200, "text/plain", "Command: " + direction);
}

void setupDrinksAPI(AsyncWebServer& server) {
    server.on("/drinks/navigation", HTTP_GET, controlCocktail);
}
