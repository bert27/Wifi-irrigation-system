#pragma once
#include <espnow.h>
#include <vector>
#include <functional>
#include "remote_protocol.h"

/**
 * Hub central de control remoto para el Robot (Servidor).
 * Se encarga ÚNICAMENTE de recibir ESP-NOW y notificar a las apps interesadas.
 * No realiza transmisiones de telemetría (WebSockets) para ahorrar CPU.
 */
class RemoteControlHub {
public:
    using RemoteCallback = std::function<void(const struct_message&)>;

    static RemoteControlHub& getInstance() {
        static RemoteControlHub instance;
        return instance;
    }

    void begin() {
        if (esp_now_init() != 0) {
            Serial.println("HUB: ESP-NOW Init failed");
            return;
        }
        esp_now_set_self_role(ESP_NOW_ROLE_SLAVE);
        esp_now_register_recv_cb(OnDataRecv);
        Serial.println("HUB: Remote Hub Ready (Hardware Only)");
    }

    void subscribe(RemoteCallback callback) {
        listeners.push_back(callback);
    }

private:
    std::vector<RemoteCallback> listeners;
    RemoteControlHub() {}

    static void OnDataRecv(uint8_t * mac, uint8_t *incomingData, uint8_t len) {
        struct_message msg;
        memcpy(&msg, incomingData, sizeof(msg));

        for (auto& callback : getInstance().listeners) {
            callback(msg);
        }
    }
};

inline void setupRemoteHub() {
    RemoteControlHub::getInstance().begin();
}
