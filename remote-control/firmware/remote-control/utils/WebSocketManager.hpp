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
            switch (type) {
                case WS_EVT_CONNECT:
                    Serial.printf("WS: Client #%u connected from %s\n", client->id(), client->remoteIP().toString().c_str());
                    break;
                case WS_EVT_DISCONNECT:
                    Serial.printf("WS: Client #%u disconnected\n", client->id());
                    break;
                case WS_EVT_ERROR:
                    Serial.printf("WS: Client #%u error\n", client->id());
                    break;
                case WS_EVT_PONG:
                    // Serial.printf("WS: Client #%u pong\n", client->id());
                    break;
                case WS_EVT_DATA:
                    // Serial.printf("WS: Data received from #%u\n", client->id());
                    break;
            }
        });
        server.addHandler(&ws);
        Serial.println("REMOTE WS: Handler attached at /ws");
    }

    void broadcastState(float gx, float gy, String joyDir, bool buttonPressed) {
        if (ws.count() == 0) return;

        static unsigned long lastBroadcast = 0;
        if (millis() - lastBroadcast < 100) return; // Limit to 10Hz
        lastBroadcast = millis();

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
    WebSocketManager() : ws("/ws") {}
};
