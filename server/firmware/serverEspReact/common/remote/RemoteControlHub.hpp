#pragma once
#include <espnow.h>
#include <vector>
#include <functional>
#include <queue>
#include "remote_protocol.hpp"

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
        esp_now_set_self_role(ESP_NOW_ROLE_COMBO);
        esp_now_register_recv_cb(OnDataRecv);
        esp_now_register_send_cb(OnDataSent);

        // Register broadcast peer to allow sending
        uint8_t broadcastAddress[] = {0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF};
        esp_now_add_peer(broadcastAddress, ESP_NOW_ROLE_COMBO, 0, NULL, 0);

        Serial.printf("HUB: Remote Hub Ready. Message Size: %d\n", (int)sizeof(struct_message));
    }

    uint8_t* getLastSenderMac() { return lastSenderMac; }

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
    uint8_t lastSenderMac[6] = {0, 0, 0, 0, 0, 0};

    RemoteControlHub() {}

    static void OnDataSent(uint8_t* mac, uint8_t status) {
        if (status == 0) {
            // Serial.println("HUB: Send Success (ACK received)");
        } else {
            Serial.printf("HUB: Send Fail to %02X:%02X:%02X:%02X:%02X:%02X\n", mac[0], mac[1], mac[2], mac[3], mac[4], mac[5]);
        }
    }

    static void OnDataRecv(uint8_t * mac, uint8_t *incomingData, uint8_t len) {
        Serial.printf("HUB: Data Recv! Len: %d (Expected: %d) from %02X:%02X:%02X:%02X:%02X:%02X\n", 
                      (int)len, (int)sizeof(struct_message), mac[0], mac[1], mac[2], mac[3], mac[4], mac[5]);
        
        memcpy(getInstance().lastSenderMac, mac, 6);

        if (len == sizeof(struct_message)) {
            struct_message msg;
            memcpy(&msg, incomingData, sizeof(msg));
            getInstance().messageQueue.push(msg);
        } else {
            Serial.println("HUB: Size mismatch, message ignored.");
        }
    }
};

inline void setupRemoteHub() {
    RemoteControlHub::getInstance().begin();
}

inline void loopRemoteHub() {
    RemoteControlHub::getInstance().handleEvents();
}
