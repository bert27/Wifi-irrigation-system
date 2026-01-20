#pragma once

#include <Wire.h>
#include "../services/websocket.hpp"

/*
 * MPU6050 Gyroscope Manager
 * Defines standard MPU6050 register addresses and provides
 * a Singleton class to manage initialization and data reading.
 */

const int MPU_ADDR = 0x68; // I2C address of the MPU-6050

class GyroscopeManager {
public:
    static GyroscopeManager& getInstance() {
        static GyroscopeManager instance;
        return instance;
    }

    void begin() {
        Wire.begin();
        Wire.beginTransmission(MPU_ADDR);
        Wire.write(0x6B);  // PWR_MGMT_1 register
        Wire.write(0);     // set to zero (wakes up the MPU-6050)
        Wire.endTransmission(true);
        Serial.println("Gyroscope (MPU6050) Initialized");
    }

    // Reads raw data and calculates simplified pitch/roll
    // Returns a JSON-formatted string for the WebSocket
    // Format: "{\"giroscopeValues\": [pitch, roll]}"
    String getValuesJson() {
        Wire.beginTransmission(MPU_ADDR);
        Wire.write(0x3B);  // starting with register 0x3B (ACCEL_XOUT_H)
        Wire.endTransmission(false);
        Wire.requestFrom((uint8_t)MPU_ADDR, (size_t)14, true); // request a total of 14 registers

        int16_t AcX = Wire.read() << 8 | Wire.read(); // 0x3B (ACCEL_XOUT_H) & 0x3C (ACCEL_XOUT_L)
        int16_t AcY = Wire.read() << 8 | Wire.read(); // 0x3D (ACCEL_YOUT_H) & 0x3E (ACCEL_YOUT_L)
        int16_t AcZ = Wire.read() << 8 | Wire.read(); // 0x3F (ACCEL_ZOUT_H) & 0x40 (ACCEL_ZOUT_L)
        // Skip Temperature and Gyro data for basic tilt calculation if not needed
        // int16_t Tmp = Wire.read()<<8|Wire.read(); 
        // int16_t GyX = Wire.read()<<8|Wire.read(); 
        // int16_t GyY = Wire.read()<<8|Wire.read(); 
        // int16_t GyZ = Wire.read()<<8|Wire.read(); 

        // Calculate Pitch and Roll (Simplified)
        // 16384.0 is the sensitivity for the default +/- 2g range
        double x = AcX / 16384.0;
        double y = AcY / 16384.0;
        double z = AcZ / 16384.0;

        // Basic calculation (in radians, roughly)
        // Ideally should include Gyro data and Kalman filter for stability,
        // but this provides basic orientation for the dashboard.
        double pitch = atan2(y, sqrt(x * x + z * z));
        double roll = atan2(-x, z);

        String json = "{\"giroscopeValues\": [" + String(pitch) + "," + String(roll) + "]}";
        return json;
    }

    void broadcastValues(const String& direction) {
        Wire.beginTransmission(MPU_ADDR);
        Wire.write(0x3B);
        Wire.endTransmission(false);
        Wire.requestFrom((uint8_t)MPU_ADDR, (size_t)14, true);

        int16_t AcX = Wire.read() << 8 | Wire.read();
        int16_t AcY = Wire.read() << 8 | Wire.read();
        int16_t AcZ = Wire.read() << 8 | Wire.read();

        double x = AcX / 16384.0;
        double y = AcY / 16384.0;
        double z = AcZ / 16384.0;

        double pitch = atan2(y, sqrt(x * x + z * z)) * 180 / M_PI;
        double roll = atan2(-x, z) * 180 / M_PI;

        CarWebSocketHandler::getInstance().broadcastTelemetry(pitch, roll, direction);
    }

    void loop() {
        // Optional: Implement periodic reading here if not polling on demand
    }

private:
   GyroscopeManager() {} // Private constructor
};

inline void setupGyroscope() {
    GyroscopeManager::getInstance().begin();
}

inline String getGyroscopeData() {
    return GyroscopeManager::getInstance().getValuesJson();
}
