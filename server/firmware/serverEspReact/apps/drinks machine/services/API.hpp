#pragma once

#include <ESPAsyncWebServer.h>
#include "../controller.hpp"

void controlCocktail(AsyncWebServerRequest *request) {
    String direction = "No direction sent";
    if (request->hasParam("direction")) {
        direction = request->getParam("direction")->value();
        
        if (direction == "next" || direction == "down") {
            DrinksInputManager::getInstance().actionNext();
        } else if (direction == "up" || direction == "back") {
            DrinksInputManager::getInstance().actionPrev();
        } else if (direction == "accept") {
            DrinksInputManager::getInstance().actionSelect();
        }
    }
    request->send(200, "text/plain", "Command: " + direction);
}

void setupDrinksAPI(AsyncWebServer& server) {
    server.on("/drinks/navigation", HTTP_GET, controlCocktail);
}
