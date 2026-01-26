#pragma once
#include <Arduino.h>
#include <vector>
#include <LittleFS.h>
#include <ArduinoJson.h>
#include "../models/models.hpp"
#include "../config.hpp"

struct MenuEntry {
    String name;
    bool isCocktail;
    int index; // Index in bottles or cocktails
};

class MenuService {
public:
    static MenuService& getInstance() {
        static MenuService instance;
        return instance;
    }

    std::vector<IBottle> bottles;
    std::vector<ICocktail> cocktails;
    std::vector<MenuEntry> menu;

    void begin() {
        if(!LittleFS.begin()){
            Serial.println("LittleFS Mount Failed");
        } else {
            Serial.println("LittleFS Mounted Successfully");
            loadBottles();
            loadCocktails();
        }
    }

    void refreshMenu() {
        menu.clear();
        for (int i = 0; i < (int)cocktails.size(); i++) {
            menu.push_back({ cocktails[i].name, true, i });
        }
    }

    void updateCocktail(const String& name, const std::vector<ILiquidProp>& ingredients) {
        bool found = false;
        for (auto& c : cocktails) {
            if (c.name == name) {
                c.ingredients = ingredients;
                found = true;
                break;
            }
        }
        if (!found) {
            cocktails.push_back({ name, ingredients });
        }
        refreshMenu();
        saveCocktails();
    }

    void resetToDefaults() {
        Serial.println(F("[Menu] Resetting configurations to defaults..."));
        LittleFS.remove("/cocktails.json");
        LittleFS.remove("/bottles.json");
        
        cocktails = getDefaultCocktails();
        bottles = getDefaultBottles();
        
        saveCocktails();
        saveBottles();
        refreshMenu();
        
        Serial.println(F("[Menu] Reset complete. Default values restored."));
    }

    void saveBottles() {
        File file = LittleFS.open("/bottles.json", "w");
        if (!file) {
            Serial.println("Failed to open bottles file for writing");
            return;
        }

        JsonDocument doc;
        JsonArray array = doc.to<JsonArray>();
        for (const auto& b : bottles) {
            JsonObject obj = array.add<JsonObject>();
            obj["id"] = b.id;
            obj["title"] = b.title;
            obj["liquid"] = b.liquid;
            obj["pwm"] = b.pwm;
            obj["timeCalibration"] = b.timeCalibration;
        }

        if (serializeJson(doc, file) == 0) {
            Serial.println("Failed to write to bottles file");
        }
        file.close();
        Serial.println("Bottles saved to LittleFS");
    }

private:
    MenuService() {
        bottles = getDefaultBottles();
        refreshMenu();
    }

    void loadCocktails() {
        if (!LittleFS.exists("/cocktails.json")) {
            Serial.println(F("[Menu] No cocktails file found, using defaults"));
            cocktails = getDefaultCocktails();
            saveCocktails();
            return;
        }

        File file = LittleFS.open("/cocktails.json", "r");
        if (!file) {
            Serial.println("Failed to open cocktails file");
            return;
        }

        JsonDocument doc;
        DeserializationError error = deserializeJson(doc, file);
        file.close();

        if (error) {
            Serial.println("Failed to parse cocktails JSON");
            return;
        }

        cocktails.clear();
        JsonArray array = doc.as<JsonArray>();
        for (JsonObject obj : array) {
            ICocktail c;
            c.name = obj["name"].as<String>();
            JsonArray ingArray = obj["ingredients"].as<JsonArray>();
            for (JsonObject ing : ingArray) {
                c.ingredients.push_back({ ing["name"].as<String>(), ing["quantity"].as<int>() });
            }
            cocktails.push_back(c);
        }
        refreshMenu();
        Serial.printf("Loaded %d cocktails from LittleFS\n", (int)cocktails.size());
    }

    void saveCocktails() {
        File file = LittleFS.open("/cocktails.json", "w");
        if (!file) {
            Serial.println("Failed to open cocktails file for writing");
            return;
        }

        JsonDocument doc;
        JsonArray array = doc.to<JsonArray>();
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

        if (serializeJson(doc, file) == 0) {
            Serial.println("Failed to write to file");
        }
        file.close();
        Serial.println("Cocktails saved to LittleFS");
    }

    void loadBottles() {
        Serial.println(F("[Menu] Loading bottles configuration..."));
        bottles = getDefaultBottles();

        if (!LittleFS.exists("/bottles.json")) {
            Serial.println(F("[Menu] No bottles.json found. Saving defaults."));
            saveBottles();
            return;
        }

        File file = LittleFS.open("/bottles.json", "r");
        if (!file) return;

        JsonDocument doc;
        DeserializationError error = deserializeJson(doc, file);
        file.close();

        if (error) {
            Serial.println(F("[Menu] Error parsing bottles.json. Keeping defaults."));
            return;
        }

        JsonArray array = doc.as<JsonArray>();
        for (int i = 0; i < (int)bottles.size() && i < (int)array.size(); i++) {
            JsonObject obj = array[i];
            
            if (obj.containsKey("pwm")) {
                bottles[i].pwm = obj["pwm"].as<int>();
            }
            
            if (obj.containsKey("timeCalibration")) {
                float val = obj["timeCalibration"].as<float>();
                // Only overwrite if value is reasonable (> 0.01s)
                if (val > 0.01f) {
                    bottles[i].timeCalibration = val;
                } else {
                    Serial.printf("[Menu] Alert: Invalid calibration for pump %d (%.2f). Using default: %.2fs\n", 
                                  bottles[i].id, val, getDefaultBottles()[i].timeCalibration);
                }
            }
        }
        Serial.println(F("[Menu] Bottles loaded successfully."));
    }
};
