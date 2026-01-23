#pragma once
#include <Arduino.h>

// --- mDNS Configuration ---
static constexpr const char* MDNS_HOSTNAME = "irrigation-system";

// --- Pin Definitions ---
// Irrigation uses Pump 1 (0) and DS3231 RTC
static constexpr uint8_t PIN_IRRIGATION_PUMP = 0;
static constexpr uint8_t PIN_RTC_SDA = 1; // D7
static constexpr uint8_t PIN_RTC_SCL = 3; // D8
