#pragma once
#include <Arduino.h>
#include "../secrets.h"

// MAC Address of the Robot (Receiver)
// Update this with the real MAC of your ESP8266 Robot
// You can get it by calling WiFi.macAddress() in the robot's setup
uint8_t robotAddress[] = {0x48, 0xE7, 0x29, 0xA0, 0x0E, 0xD8}; 

// Pin Definitions for ESP32 Remote
const int PIN_JOY_X = 36;
const int PIN_JOY_Y = 39;
const int PIN_JOY_BTN = 34;

// Joystick Calibration
const int JOY_THRESHOLD_UP = 3000;
const int JOY_THRESHOLD_DOWN = 1000;

// Communication Settings
const char* REMOTE_SSID = WIFI_SSID; // Used for channel scanning
