#pragma once
#include "I2Cdev.h"
#include "MPU6050_6Axis_MotionApps20.h"
#include <Arduino.h>

#if I2CDEV_IMPLEMENTATION == I2CDEV_ARDUINO_WIRE
#include "Wire.h"
#endif

// Calibration Offsets
#define AX_OFFSET -3906
#define AY_OFFSET 3241
#define AZ_OFFSET 1247
#define GX_OFFSET 137
#define GY_OFFSET -73
#define GZ_OFFSET -30

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

        if (!mpu.testConnection()) {
            Serial.println(F("REMOTE: MPU6050 connection failed"));
            return;
        }

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
