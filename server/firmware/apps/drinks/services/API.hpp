#pragma once

#include <ESPAsyncWebServer.h>
#include "../display.hpp"

void controlCocktail(AsyncWebServerRequest *request) {
    String direction = "No direction sent";
    if (request->hasParam("direction")) {
        direction = request->getParam("direction")->value();
        DisplayManager::getInstance().control(direction);
    }
    request->send(200, "text/plain", "the direction is: " + direction);
}

void setupDrinksAPI(AsyncWebServer& server) {
    server.on("/control", HTTP_GET, controlCocktail);
}
