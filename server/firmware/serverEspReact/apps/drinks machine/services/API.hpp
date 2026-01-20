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

    server.on("/drinks/cocktails", HTTP_GET, [](AsyncWebServerRequest *request) {
        JsonDocument doc;
        JsonArray array = doc.to<JsonArray>();
        auto& cocktails = DrinksInputManager::getInstance().cocktails;
        
        for (const auto& c : cocktails) {
            JsonObject obj = array.add<JsonObject>();
            obj["name"] = c.name;
            JsonArray ingArray = obj["ingredients"].to<JsonArray>();
            for (const auto& ing : c.ingredients) {
                JsonObject ingObj = ingArray.add<JsonObject>();
                ingObj["name"] = ing.name;
                ingObj["quantity"] = ing.quantity;
            }
        }
        
        String response;
        serializeJson(doc, response);
        request->send(200, "application/json", response);
    });

    server.on("/drinks/save-cocktail", HTTP_POST, [](AsyncWebServerRequest *request) {
        // We'll handle body in the onBody callback or use this if it's small? 
        // For simplicity with AsyncWebServer POST JSON:
    }, NULL, [](AsyncWebServerRequest *request, uint8_t *data, size_t len, size_t index, size_t total) {
        if (index == 0 && total > 0) {
            JsonDocument doc;
            DeserializationError error = deserializeJson(doc, data, len);
            if (!error) {
                String name = doc["name"].as<String>();
                JsonArray ings = doc["ingredients"].as<JsonArray>();
                std::vector<LiquidProp> ingredients;
                for (JsonObject ing : ings) {
                    ingredients.push_back({ ing["name"].as<String>(), ing["quantity"].as<int>() });
                }
                DrinksInputManager::getInstance().updateCocktail(name, ingredients);
                request->send(200, "text/plain", "Cocktail saved");
            } else {
                request->send(400, "text/plain", "Invalid JSON");
            }
        }
    });
}
