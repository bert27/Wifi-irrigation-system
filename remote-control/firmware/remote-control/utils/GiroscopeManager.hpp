#pragma once
#include "I2Cdev.h"
#include "MPU6050_6Axis_MotionApps20.h"
#include <Arduino.h>

#if I2CDEV_IMPLEMENTATION == I2CDEV_ARDUINO_WIRE
#include "Wire.h"
#endif

// Calibration Offsets (Reset to 0 for new GY-91 sensor - Calibrate if needed)
#define AX_OFFSET 0
#define AY_OFFSET 0
#define AZ_OFFSET 0
#define GX_OFFSET 0
#define GY_OFFSET 0
#define GZ_OFFSET 0

#define INTERRUPT_PIN 4

class GiroscopeManager {
public:
    static GiroscopeManager& getInstance() {
        static GiroscopeManager instance;
        return instance;
    }

    void begin() {
        Wire.begin();
        Serial.println(F("REMOTE: Initializing MPU6050..."));
        mpu.initialize();
        pinMode(INTERRUPT_PIN, INPUT);
        
        // Debug: I2C Scanner
        Serial.println("Scanning I2C bus...");
        for(byte address = 1; address < 127; address++ ) {
            Wire.beginTransmission(address);
            if (Wire.endTransmission() == 0) {
                Serial.print("I2C device found at address 0x");
                if (address<16) Serial.print("0");
                Serial.println(address,HEX);
            }
        }

        Serial.print("MPU Device ID: 0x");
        Serial.println(mpu.getDeviceID(), HEX);

        if (!mpu.testConnection()) {
            Serial.println(F("REMOTE: Connection test failed (ID Mismatch?), but I2C device found. Proceeding anyway..."));
            // return; // Bypass check to support MPU9250/GY-91
        }
        
        Serial.println(F("REMOTE: Initializing DMP..."));
        devStatus = mpu.dmpInitialize();

        // Apply offsets
        mpu.setXAccelOffset(AX_OFFSET);
        mpu.setYAccelOffset(AY_OFFSET);
        mpu.setZAccelOffset(AZ_OFFSET);
        mpu.setXGyroOffset(GX_OFFSET);
        mpu.setYGyroOffset(GY_OFFSET);
        mpu.setZGyroOffset(GZ_OFFSET);

        if (devStatus == 0) {
            mpu.setDMPEnabled(true);
            attachInterrupt(digitalPinToInterrupt(INTERRUPT_PIN), dmpDataReady, RISING);
            dmpReady = true;
            packetSize = mpu.dmpGetFIFOPacketSize();
        }
    }

    String getDirection() {
        if (!dmpReady) return "Sin movimiento";

        if (!mpuInterrupt && fifoCount < packetSize) {
            fifoCount = mpu.getFIFOCount();
            return lastDirection;
        }

        mpuInterrupt = false;
        uint8_t mpuIntStatus = mpu.getIntStatus();
        fifoCount = mpu.getFIFOCount();

        if ((mpuIntStatus & 0x10) || fifoCount == 1024) {
            mpu.resetFIFO();
        } else if (mpuIntStatus & 0x02) {
            while (fifoCount < packetSize) fifoCount = mpu.getFIFOCount();
            mpu.getFIFOBytes(fifoBuffer, packetSize);
            fifoCount -= packetSize;
            
            Quaternion q;
            float euler[3];
            mpu.dmpGetQuaternion(&q, fifoBuffer);
            mpu.dmpGetEuler(euler, &q);

            float Xdegree = euler[1] * 180 / M_PI;
            float Ydegree = euler[2] * 180 / M_PI;

            lastDirection = calculateDirection(Xdegree, Ydegree);
            lastX = Xdegree;
            lastY = Ydegree;
        }
        return lastDirection;
    }
    
    float getX() { return lastX; }
    float getY() { return lastY; }

private:
    MPU6050 mpu;
    bool dmpReady = false;
    uint8_t devStatus;
    uint16_t packetSize;
    uint16_t fifoCount;
    uint8_t fifoBuffer[64];
    String lastDirection = "Sin movimiento";
    float lastX = 0, lastY = 0;

    static volatile bool mpuInterrupt;
    static void dmpDataReady() { mpuInterrupt = true; }

    String calculateDirection(float Xdegree, float Ydegree) {
        bool esIzquierda = (Ydegree >= 25);
        bool esDerecha = (Ydegree <= -20);
        bool esArriba = (Xdegree <= -5);
        bool esAbajo = (Xdegree >= 25);

        if (esArriba) return "Arriba";
        if (esAbajo) return "Abajo";
        if (esIzquierda) return "Izquierda";
        if (esDerecha) return "Derecha";
        
        return "Sin movimiento";
    }

    GiroscopeManager() {}
};

volatile bool GiroscopeManager::mpuInterrupt = false;
