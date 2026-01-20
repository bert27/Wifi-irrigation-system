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
        }
    }
    request->send(200, "text/plain", "Command: " + direction);
}

void setupDrinksAPI(AsyncWebServer& server) {
    server.on("/drinks/navigation", HTTP_GET, controlCocktail);
}
