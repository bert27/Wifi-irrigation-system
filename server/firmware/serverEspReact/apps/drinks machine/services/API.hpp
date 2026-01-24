#pragma once

#include <ESPAsyncWebServer.h>
#include "../DrinksMachine.hpp"
#include "MenuService.hpp"  // Direct access to data services

void controlCocktail(AsyncWebServerRequest *request) {
    String direction = "No direction sent";
    if (request->hasParam("direction")) {
        direction = request->getParam("direction")->value();
        
        if (direction == "next" || direction == "down") {
            DrinksMachine::getInstance().enqueueCommand("next");
        } else if (direction == "up") {
            DrinksMachine::getInstance().enqueueCommand("prev");
        } else if (direction == "accept") {
            DrinksMachine::getInstance().enqueueCommand("select");
        } else if (direction == "back") {
            DrinksMachine::getInstance().enqueueCommand("back");
        } else if (direction == "cancel") {
            DrinksMachine::getInstance().enqueueCommand("cancel");
        } else if (direction.startsWith("goto:")) {
            DrinksMachine::getInstance().enqueueCommand(direction);
        } else if (direction.startsWith("pump:")) {
            DrinksMachine::getInstance().enqueueCommand(direction);
        } else if (direction == "goto" && request->hasParam("index")) {
            String index = request->getParam("index")->value();
            DrinksMachine::getInstance().enqueueCommand("goto:" + index);
        } else if (direction == "config" && request->hasParam("id") && request->hasParam("pwm") && request->hasParam("time")) {
            String id = request->getParam("id")->value();
            String pwm = request->getParam("pwm")->value();
            String time = request->getParam("time")->value();
            DrinksMachine::getInstance().enqueueCommand("pump:" + id + ":" + pwm + ":" + time);
        }
    }
    request->send(200, "text/plain", "Command: " + direction);
}

void setupDrinksAPI(AsyncWebServer& server) {
    server.on("/drinks/navigation", HTTP_GET, controlCocktail);

    server.on("/drinks/ping", HTTP_GET, [](AsyncWebServerRequest *request) {
        request->send(200, "text/plain", "pong");
    });

    server.on("/drinks/cocktails", HTTP_GET, [](AsyncWebServerRequest *request) {
        JsonDocument doc;
        JsonArray array = doc.to<JsonArray>();
        auto& cocktails = MenuService::getInstance().cocktails;
        
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

    server.on("/drinks/bottles", HTTP_GET, [](AsyncWebServerRequest *request) {
        JsonDocument doc;
        JsonArray array = doc.to<JsonArray>();
        auto& bottles = MenuService::getInstance().bottles;
        
        for (const auto& b : bottles) {
            JsonObject obj = array.add<JsonObject>();
            obj["id"] = b.id;
            obj["title"] = b.title;
            obj["liquid"] = b.liquid;
            obj["pwm"] = b.pwm;
            obj["timeCalibration"] = b.timeCalibration;
        }
        
        String response;
        serializeJson(doc, response);
        request->send(200, "application/json", response);
    });

    server.on("/drinks/save-cocktail", HTTP_POST, [](AsyncWebServerRequest *request) {
        // No-op
    }, NULL, [](AsyncWebServerRequest *request, uint8_t *data, size_t len, size_t index, size_t total) {
        static String bodyStr = "";
        if (index == 0) bodyStr = "";
        
        for (size_t i = 0; i < len; i++) bodyStr += (char)data[i];

        if (index + len == total) {
            JsonDocument doc;
            DeserializationError error = deserializeJson(doc, bodyStr);
            if (!error) {
                String name = doc["name"].as<String>();
                JsonArray ings = doc["ingredients"].as<JsonArray>();
                std::vector<ILiquidProp> ingredients;
                for (JsonObject ing : ings) {
                    ingredients.push_back({ ing["name"].as<String>(), ing["quantity"].as<int>() });
                }
                MenuService::getInstance().updateCocktail(name, ingredients);
                request->send(200, "text/plain", "Cocktail saved");
            } else {
                request->send(400, "text/plain", "Invalid JSON");
            }
            bodyStr = ""; // Reset
        }
    });

    server.on("/drinks/reset-recipes", HTTP_POST, [](AsyncWebServerRequest *request) {
        MenuService::getInstance().resetToDefaults();
        request->send(200, "text/plain", "Recipes reset to defaults successfully");
    });
}
