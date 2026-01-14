#pragma once
#include <WiFi.h>
#include <esp_now.h>
#include <esp_wifi.h>
#include "config.h"

struct ValuesGiroscope {
    float X;
    float Y;
};

struct JoystickData {
    String buttonState;
    String direction;
};

// Data structure to send, matching the robot's expectations
typedef struct struct_message {
    int id;
    float temp;
    int idReading;
    char choose[85];      // Command from joystick
    char giroscope[85];    // Command from gyroscope
    ValuesGiroscope giroscopeValues;
    JoystickData joystickValues;
} struct_message;

class CommunicationManager {
public:
    static CommunicationManager& getInstance() {
        static CommunicationManager instance;
        return instance;
    }

    void begin() {
        // Init WiFi in STA mode for ESP-NOW
        WiFi.mode(WIFI_STA);
        
        // Scan for channel if needed
        int32_t channel = getWiFiChannel(REMOTE_SSID);
        esp_wifi_set_channel(channel, WIFI_SECOND_CHAN_NONE);

        if (esp_now_init() != ESP_OK) {
            Serial.println("Error initializing ESP-NOW");
            return;
        }

        // Register peer
        memcpy(peerInfo.peer_addr, robotAddress, 6);
        peerInfo.channel = 0;
        peerInfo.encrypt = false;

        if (esp_now_add_peer(&peerInfo) != ESP_OK) {
            Serial.println("Failed to add peer");
            return;
        }
    }

    void send(const struct_message& msg) {
        esp_err_t result = esp_now_send(robotAddress, (uint8_t *)&msg, sizeof(msg));
        if (result != ESP_OK) {
            // Serial.println("Error sending data");
        }
    }

private:
    esp_now_peer_info_t peerInfo;

    CommunicationManager() {}

    int32_t getWiFiChannel(const char *ssid) {
        if (int32_t n = WiFi.scanNetworks()) {
            for (uint8_t i = 0; i < n; i++) {
                if (!strcmp(ssid, WiFi.SSID(i).c_str())) {
                    return WiFi.channel(i);
                }
            }
        }
        return 0;
    }
};
