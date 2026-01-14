#pragma once

#include <ESPAsyncWebServer.h>
#include <ArduinoJson.h>

class CarWebSocketHandler {
public:
    static CarWebSocketHandler& getInstance() {
        static CarWebSocketHandler instance;
        return instance;
    }

    void setup(AsyncWebServer& server) {
        ws.onEvent([this](AsyncWebSocket *server, AsyncWebSocketClient *client, AwsEventType type, void *arg, uint8_t *data, size_t len) {
            this->onEvent(server, client, type, arg, data, len);
        });
        server.addHandler(&ws);
        Serial.println("CAR: WebSocket Handler attached at /ws/car");
    }

    void broadcast(const String& message) {
        ws.textAll(message);
    }

    void broadcastTelemetry(float pitch, float roll, const String& direction) {
        StaticJsonDocument<256> doc;
        doc["type"] = "car_telemetry";
        doc["pitch"] = pitch;
        doc["roll"] = roll;
        doc["direction"] = direction;
        
        String output;
        serializeJson(doc, output);
        broadcast(output);
    }

private:
    AsyncWebSocket ws;
    CarWebSocketHandler() : ws("/ws/car") {}

    void onEvent(AsyncWebSocket *server, AsyncWebSocketClient *client, AwsEventType type, void *arg, uint8_t *data, size_t len) {
        if (type == WS_EVT_CONNECT) {
            Serial.printf("CAR WS: Client #%u connected from %s\n", client->id(), client->remoteIP().toString().c_str());
            client->text("{\"type\":\"welcome\",\"message\":\"Car Telemetry Connected\"}");
        } else if (type == WS_EVT_DISCONNECT) {
            Serial.printf("CAR WS: Client #%u disconnected\n", client->id());
        }
    }
};

inline void setupCarWebSocket(AsyncWebServer& server) {
    CarWebSocketHandler::getInstance().setup(server);
}
