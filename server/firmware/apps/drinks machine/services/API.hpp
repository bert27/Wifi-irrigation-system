#pragma once

#include <ESPAsyncWebServer.h>
#include "../controller.hpp"

void controlCocktail(AsyncWebServerRequest *request) {
    String direction = "No direction sent";
    if (request->hasParam("direction")) {
        direction = request->getParam("direction")->value();
        
        if (direction == "next" || direction == "down") {
            EncoderManager::getInstance().processRotation(true);
        } else if (direction == "up" || direction == "back") {
            EncoderManager::getInstance().processRotation(false);
        } else if (direction == "accept") {
            EncoderManager::getInstance().clickButton();
        }
    }
    request->send(200, "text/plain", "Command: " + direction);
}

void setupDrinksAPI(AsyncWebServer& server) {
    server.on("/control", HTTP_GET, controlCocktail);
}
