#pragma once

#include "WString.h"
#include <RTClib.h>
#include <ArduinoJson.h>
#include "AsyncJson.h"
#include <vector>
#include <map>

#include "config.hpp"
#include "models.hpp"
#include "utils/ds3231.hpp"
#include "utils/TemperatureManager.hpp"

class IrrigationSystem {
public:
    static IrrigationSystem& getInstance() {
        static IrrigationSystem instance;
        return instance;
    }

    void begin() {
        DS3231Manager::getInstance().begin();
        setupPins();
        server.begin();
        Serial.println("IRRIGATION: HTTP server started");
    }

public:
    AsyncWebServer server;
    std::vector<IScheduledTask> tasks;
    const size_t MAX_TASKS = 20;

    const char* daysOfWeek[7] = { "Lunes", "Martes", "Miercoles", "Jueves", "Viernes", "Sabado", "Domingo" };

    IrrigationSystem() : server(80) {}


    void setupPins() {
        pinMode(PIN_IRRIGATION_PUMP, OUTPUT); digitalWrite(PIN_IRRIGATION_PUMP, LOW);
    }

    void handlePumpControl(AsyncWebServerRequest *request) {
        Serial.println("GET /waterPump1OnOFF");
        if (request->params() < 2) { 
            request->send(400, "text/plain", "Missing Params");
            return;
        }

        int id = request->getParam(0)->value().toInt();
        int pwm = request->getParam(1)->value().toInt();
        
        switch (id) {
            case 1: analogWrite(PIN_IRRIGATION_PUMP, pwm); break;
            default: break;
        }
        request->send(200, "text/plain", "OK");
    }

    String getClockString() {
        return DS3231Manager::getInstance().getClockString();
    }

    void handleGetList(AsyncWebServerRequest *request) {
        String allData = "";
        for (const auto& task : tasks) {
            allData += task.days + "-" + task.hour + "-" + task.minute + "/";
        }
        request->send(200, "text/plain", allData);
    }

    void handleGetTemperature(AsyncWebServerRequest *request) {
         request->send(200, "text/plain", TemperatureManager::getInstance().getFormattedTemperature());
    }

    void handleAddTask(AsyncWebServerRequest *request) {
        if (!request->hasParam("hour") || !request->hasParam("minutes") || !request->hasParam("days")) {
             request->send(400, "text/plain", "Missing Parameters");
             return;
        }

        String hour = request->getParam("hour")->value();
        String minute = request->getParam("minutes")->value();
        String daysParam = request->getParam("days")->value();

        Serial.println("New Task Request: " + daysParam + " @" + hour + ":" + minute);

        if (tasks.size() >= MAX_TASKS) {
             Serial.println("List full");
             request->send(507, "text/plain", "List Full");
             return;
        }

        int str_len = daysParam.length() + 1;
        char char_array[str_len];
        daysParam.toCharArray(char_array, str_len);
        char *ptr = strtok(char_array, ",");
        
        while (ptr != NULL) {
            ptr = strtok(NULL, ",");
        }
        
        // ArduinoJson v5 Syntax
        DynamicJsonBuffer jsonBuffer;
        JsonArray& array = jsonBuffer.parseArray(daysParam);

        if (array.success()) {
            for(const auto& v : array) {
                String dayName = v.as<String>();
                if (tasks.size() < MAX_TASKS) {
                    tasks.push_back({dayName, hour, minute});
                    Serial.println("Added task: " + dayName);
                }
            }
        } else {
             int start = 0;
             int end = daysParam.indexOf(',');
             while (end != -1) {
                 String d = daysParam.substring(start, end);
                 d.replace("[", ""); d.replace("]", ""); d.replace("\"", "");
                 if (tasks.size() < MAX_TASKS) {
                     tasks.push_back({d, hour, minute});
                 }
                 start = end + 1;
                 end = daysParam.indexOf(',', start);
             }
             String last = daysParam.substring(start);
             last.replace("[", ""); last.replace("]", ""); last.replace("\"", "");
             if (last.length() > 0 && tasks.size() < MAX_TASKS) {
                 tasks.push_back({last, hour, minute});
             }
        }

        request->send(200, "text/plain", "OK");
    }
};

inline void setupPlantController() {
    IrrigationSystem::getInstance().begin();
}
