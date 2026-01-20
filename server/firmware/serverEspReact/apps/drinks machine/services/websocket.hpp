#pragma once

#include <ESPAsyncWebServer.h>
#include <ArduinoJson.h>

using namespace ArduinoJson;

class DrinksWebSocketHandler {
public:
    static DrinksWebSocketHandler& getInstance() {
        static DrinksWebSocketHandler instance;
        return instance;
    }

    void setup(AsyncWebServer& server) {
        ws.onEvent([this](AsyncWebSocket *server, AsyncWebSocketClient *client, AwsEventType type, void *arg, uint8_t *data, size_t len) {
            if (type == WS_EVT_CONNECT) {
                client->text("{\"type\":\"drinks_welcome\"}");
            }
        });
        server.addHandler(&ws);
    }

    void broadcastState(int currentDrinkIdx, const String& drinkName, int screen, bool isServing) {
        JsonDocument doc;
        doc["type"] = "drinks_state";
        doc["index"] = currentDrinkIdx;
        doc["name"] = drinkName;
        doc["screen"] = screen;
        doc["serving"] = isServing;

        String json;
        serializeJson(doc, json);
        ws.textAll(json);
    }

private:
    AsyncWebSocket ws;
    DrinksWebSocketHandler() : ws("/ws/drinks") {}
};

inline void setupDrinksWebSocket(AsyncWebServer& server) {
    DrinksWebSocketHandler::getInstance().setup(server);
}
