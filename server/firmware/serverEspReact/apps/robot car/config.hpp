#pragma once
#include <Arduino.h>

// --- mDNS Configuration ---
static constexpr const char* MDNS_HOSTNAME = "robot-car";

// --- Motor Pin Definitions ---
static constexpr uint8_t PIN_MOTOR_A_SPEED = 5; // D1
static constexpr uint8_t PIN_MOTOR_A_DIR   = 0; // D3
static constexpr uint8_t PIN_MOTOR_B_SPEED = 4; // D2
static constexpr uint8_t PIN_MOTOR_B_DIR   = 2; // D4

// --- LED Pin Definitions ---
static constexpr uint8_t PIN_LED_R = 14; // D5
static constexpr uint8_t PIN_LED_G = 12; // D6
static constexpr uint8_t PIN_LED_B = 13; // D7
static constexpr uint8_t PIN_LED_W = 15; // D8

// --- Motor Configuration ---
static constexpr uint8_t DEFAULT_MOTOR_SPEED = 150;
