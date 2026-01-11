#pragma once

#include <Arduino.h>

class CarController {
public:
    static CarController& getInstance() {
        static CarController instance;
        return instance;
    }

    void begin() {
        // Motor Pins
        pinMode(PIN_MOTOR_A_SPEED, OUTPUT);
        pinMode(PIN_MOTOR_A_DIR, OUTPUT);
        pinMode(PIN_MOTOR_B_SPEED, OUTPUT);
        pinMode(PIN_MOTOR_B_DIR, OUTPUT);

        // LED Pins
        pinMode(PIN_LED_R, OUTPUT);
        pinMode(PIN_LED_G, OUTPUT);
        pinMode(PIN_LED_B, OUTPUT);
        pinMode(PIN_LED_W, OUTPUT);

        // Initialize state
        digitalWrite(PIN_MOTOR_A_SPEED, 0);
        digitalWrite(PIN_MOTOR_B_SPEED, 0);
        digitalWrite(PIN_LED_R, 0);
        digitalWrite(PIN_LED_G, 0);
        digitalWrite(PIN_LED_B, 0);
        digitalWrite(PIN_LED_W, 0);

        Serial.println("CAR: Controller Started");
    }

    void changeColor(String color) {
        Serial.println("CAR: Converting color " + color + " to RGB and setting LEDs...");
        // Example: parse hex or name logic here
        // For now, simpler test:
        if(color == "red") {
            digitalWrite(PIN_LED_R, 1); digitalWrite(PIN_LED_G, 0); digitalWrite(PIN_LED_B, 0);
        } else if (color == "green") {
            digitalWrite(PIN_LED_R, 0); digitalWrite(PIN_LED_G, 1); digitalWrite(PIN_LED_B, 0);
        } else if (color == "blue") {
            digitalWrite(PIN_LED_R, 0); digitalWrite(PIN_LED_G, 0); digitalWrite(PIN_LED_B, 1);
        }
    }

    void toggleLED() {
        static bool state = false;
        state = !state;
        Serial.println("CAR: Toggling LED to " + String(state));
        digitalWrite(PIN_LED_W, state);
    }

    void setOutputRobot() {
        Serial.println("CAR: Setting Output Robot logic...");
    }

    void setRowTableOutputs() {
        Serial.println("CAR: Row Table Outputs logic...");
    }

    void setOutputRobotUI(String name) {
        Serial.println("CAR: UI Output logic for " + name);
    }

private:
    // Pin Definitions
    const uint8_t PIN_MOTOR_A_SPEED = 5; // D1
    const uint8_t PIN_MOTOR_A_DIR   = 0; // D3
    const uint8_t PIN_MOTOR_B_SPEED = 4; // D2
    const uint8_t PIN_MOTOR_B_DIR   = 2; // D4

    const uint8_t PIN_LED_R = 14; // D5
    const uint8_t PIN_LED_G = 12; // D6
    const uint8_t PIN_LED_B = 13; // D7
    const uint8_t PIN_LED_W = 15; // D8

    CarController() {}
};
