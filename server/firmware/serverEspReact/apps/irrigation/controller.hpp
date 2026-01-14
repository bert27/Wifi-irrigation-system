#include "WString.h"
#include <RTClib.h>
#include <ArduinoJson.h>
#include "AsyncJson.h"
#include <vector>
#include <map>

#include "utils/ds3231.hpp"
#include "utils/TemperatureManager.hpp"

// Irrigation uses Pump 1 (Shared with Drinks, but managed locally for scheduling)
constexpr uint8_t PIN_IRRIGATION_PUMP = 0;

struct ScheduledTask {
    String days;
    String hour;
    String minute;
};

class IrrigationSystem {
public:
    static IrrigationSystem& getInstance() {
        static IrrigationSystem instance;
        return instance;
    }

    void begin() {
        DS3231Manager::getInstance().begin();
        setupPins();
        // setupRoutes() moved to API.hpp
        server.begin();
        Serial.println("HTTP server started");
    }

public:
    AsyncWebServer server;
    // RTC_DS3231 rtc; // Removed, using Manager
    std::vector<ScheduledTask> tasks;
    const size_t MAX_TASKS = 20;

    const char* daysOfWeek[7] = { "Lunes", "Martes", "Miercoles", "Jueves", "Viernes", "Sabado", "Domingo" };

    IrrigationSystem() : server(80) {}


    void setupPins() {
        pinMode(PIN_IRRIGATION_PUMP, OUTPUT); digitalWrite(PIN_IRRIGATION_PUMP, LOW);
    }
    
    // setupRTC removed

    void handlePumpControl(AsyncWebServerRequest *request) {
        Serial.println("GET /waterPump1OnOFF");
        if (!request->hasParam(0) || !request->hasParam(1)) {
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
        
        int dayIndex = 0;
        
        while (ptr != NULL && dayIndex < 7) {
            String token = String(ptr);
             
            dayIndex++;
            ptr = strtok(NULL, ",");
        }
        
        DynamicJsonDocument doc(1024);
        DeserializationError error = deserializeJson(doc, daysParam);

        if (!error && doc.is<JsonArray>()) {
            JsonArray array = doc.as<JsonArray>();
            for(JsonVariant v : array) {
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

IrrigationSystem& irrigationSystem = IrrigationSystem::getInstance();

void setupPlantController() {
    irrigationSystem.begin();
}
