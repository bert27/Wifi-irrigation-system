#pragma once

#include <Arduino.h>
#include "utils/gyroscope.hpp"
#include "../../utils/remote_protocol.h"
#include "../../utils/RemoteControlHub.hpp"
#include "services/websocket.hpp"

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
        currentDirection = "CENTER";

        // Subscribe to remote control events
        RemoteControlHub::getInstance().subscribe([this](const struct_message& msg) {
            this->handleRemoteCommand(msg);
        });
    }

    void changeColor(String hexColor) {
        if (hexColor.startsWith("#")) {
            hexColor = hexColor.substring(1);
        }
        
        long number = strtol(hexColor.c_str(), nullptr, 16);
        int r = (number >> 16) & 0xFF;
        int g = (number >> 8) & 0xFF;
        int b = number & 0xFF;

        analogWrite(PIN_LED_R, r);
        analogWrite(PIN_LED_G, g);
        analogWrite(PIN_LED_B, b);
        
        Serial.printf("CAR: Color set to R:%d G:%d B:%d\n", r, g, b);
    }

    void toggleLED() {
        static bool state = false;
        state = !state;
        Serial.println("CAR: Toggling LED to " + String(state));
        digitalWrite(PIN_LED_W, state);
    }

    void setOutputRobotUI(String direction) {
        currentDirection = direction;
        if (direction == "Arriba") moveForward();
        else if (direction == "Abajo") moveBackward();
        else if (direction == "Izquierda") turnLeft();
        else if (direction == "Derecha") turnRight();
        else stopMotors();
    }

    void handleRemoteCommand(const struct_message& msg) {
        String joyDir = String(msg.choose);
        String gyroDir = String(msg.giroscope);
        static String lastRJoy = "Sin Movimiento";
        static String lastRGyro = "Sin movimiento";
        
        bool remoteActive = (joyDir != "Sin Movimiento" || gyroDir != "Sin movimiento");

        // Control motors
        if (remoteActive) {
            String target = (joyDir != "Sin Movimiento") ? joyDir : gyroDir;
            setOutputRobotUI(target);
        } else if (lastRJoy != "Sin Movimiento" || lastRGyro != "Sin movimiento") {
             setOutputRobotUI("CENTER");
        }
        
        lastRJoy = joyDir;
        lastRGyro = gyroDir;

        // The main loop() handles periodic telemetry of the vehicle's own orientation and state.
    }

    void moveForward() {
        digitalWrite(PIN_MOTOR_A_DIR, LOW);
        analogWrite(PIN_MOTOR_A_SPEED, defaultSpeed);
        digitalWrite(PIN_MOTOR_B_DIR, LOW);
        analogWrite(PIN_MOTOR_B_SPEED, defaultSpeed);
    }

    void moveBackward() {
        digitalWrite(PIN_MOTOR_A_DIR, HIGH);
        analogWrite(PIN_MOTOR_A_SPEED, defaultSpeed);
        digitalWrite(PIN_MOTOR_B_DIR, HIGH);
        analogWrite(PIN_MOTOR_B_SPEED, defaultSpeed);
    }

    void turnLeft() {
        digitalWrite(PIN_MOTOR_A_DIR, HIGH);
        analogWrite(PIN_MOTOR_A_SPEED, defaultSpeed);
        digitalWrite(PIN_MOTOR_B_DIR, LOW);
        analogWrite(PIN_MOTOR_B_SPEED, defaultSpeed);
    }

    void turnRight() {
        digitalWrite(PIN_MOTOR_A_DIR, LOW);
        analogWrite(PIN_MOTOR_A_SPEED, defaultSpeed);
        digitalWrite(PIN_MOTOR_B_DIR, HIGH);
        analogWrite(PIN_MOTOR_B_SPEED, defaultSpeed);
    }

    void stopMotors() {
        analogWrite(PIN_MOTOR_B_SPEED, 0);
    }

    void loop() {
        static unsigned long lastUpdate = 0;
        if (millis() - lastUpdate > 200) { // 5Hz Telemetry
            GyroscopeManager::getInstance().broadcastValues(currentDirection);
            lastUpdate = millis();
        }
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
    
    uint8_t defaultSpeed = 150;
    String currentDirection;

    CarController() {}
};
