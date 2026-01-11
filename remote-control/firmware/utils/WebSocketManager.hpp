#pragma once
#include <WiFi.h>
#include <ESPAsyncWebServer.h>
#include <ArduinoJson.h>

/**
 * Gestor de WebSockets para el mando físico (ESP32).
 * Transmite los datos del mando directamente a la aplicación React.
 */
class WebSocketManager {
public:
    static WebSocketManager& getInstance() {
        static WebSocketManager instance;
        return instance;
    }

    void begin(AsyncWebServer& server) {
        ws.onEvent([this](AsyncWebSocket *server, AsyncWebSocketClient *client, AwsEventType type, void *arg, uint8_t *data, size_t len) {
            if (type == WS_EVT_CONNECT) {
                Serial.printf("REMOTE WS: Client #%u connected\n", client->id());
            }
        });
        server.addHandler(&ws);
        Serial.println("REMOTE WS: Handler attached at /ws/remote");
    }

    void broadcastState(float gx, float gy, String joyDir, bool buttonPressed) {
        if (ws.count() == 0) return; // Save resources if no one is watching

        StaticJsonDocument<256> doc;
        doc["type"] = "remote_state";
        doc["gx"] = gx;
        doc["gy"] = gy;
        doc["direction"] = joyDir;
        doc["button"] = buttonPressed ? "on" : "off";

        String json;
        serializeJson(doc, json);
        ws.textAll(json);
    }

private:
    AsyncWebSocket ws;
    WebSocketManager() : ws("/ws/remote") {}
};
