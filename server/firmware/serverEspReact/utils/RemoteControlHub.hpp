#pragma once
#include <espnow.h>
#include <vector>
#include <functional>
#include <queue>
#include "remote_protocol.h"

/**
 * Central Remote Control Hub for the Robot (Server).
 * Responsible for receiving ESP-NOW messages and queuing them to be
 * safely processed in the main loop (avoids crashes/panics on ESP8266).
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
        Serial.println("HUB: Remote Hub Ready (Safe Queue Mode)");
    }

    void subscribe(RemoteCallback callback) {
        listeners.push_back(callback);
    }

    /**
     * Processes the queued messages.
     * MUST BE CALLED FROM THE MAIN LOOP.
     */
    void handleEvents() {
        while (!messageQueue.empty()) {
            struct_message msg = messageQueue.front();
            messageQueue.pop();
            
            for (auto& callback : listeners) {
                callback(msg);
            }
        }
    }

private:
    std::vector<RemoteCallback> listeners;
    std::queue<struct_message> messageQueue;
    RemoteControlHub() {}

    static void OnDataRecv(uint8_t * mac, uint8_t *incomingData, uint8_t len) {
        if (len == sizeof(struct_message)) {
            struct_message msg;
            memcpy(&msg, incomingData, sizeof(msg));
            getInstance().messageQueue.push(msg);
        }
    }
};

inline void setupRemoteHub() {
    RemoteControlHub::getInstance().begin();
}

inline void loopRemoteHub() {
    RemoteControlHub::getInstance().handleEvents();
}
