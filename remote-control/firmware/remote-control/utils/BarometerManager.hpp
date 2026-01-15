#pragma once
#include <Wire.h>
#include <Adafruit_Sensor.h>
#include <Adafruit_BMP280.h>

class BarometerManager {
public:
    static BarometerManager& getInstance() {
        static BarometerManager instance;
        return instance;
    }

    void begin() {
        Serial.println(F("REMOTE: Initializing BMP280..."));
        
        // GY-91 usually has BMP280 at 0x76.
        if (!bmp.begin(0x76)) {  
            Serial.println(F("REMOTE: Could not find a valid BMP280 sensor, check wring!"));
            // Try 0x77 just in case
            if (!bmp.begin(0x77)) {
                Serial.println(F("REMOTE: BMP280 Failed at 0x77 too."));
                return;
            }
        }

        /* Default settings from datasheet. */
        bmp.setSampling(Adafruit_BMP280::MODE_NORMAL,     /* Operating Mode. */
                        Adafruit_BMP280::SAMPLING_X2,     /* Temp. oversampling */
                        Adafruit_BMP280::SAMPLING_X16,    /* Pressure oversampling */
                        Adafruit_BMP280::FILTER_X16,      /* Filtering. */
                        Adafruit_BMP280::STANDBY_MS_500); /* Standby time. */
        
        Serial.println(F("REMOTE: BMP280 initialized successfully."));
        available = true;
    }

    float getTemperature() {
        if (!available) return 0.0;
        return bmp.readTemperature();
    }

    float getPressure() {
        if (!available) return 0.0;
        return bmp.readPressure(); // Pa
    }

    float getAltitude(float seaLevelhPa = 1013.25) {
        if (!available) return 0.0;
        return bmp.readAltitude(seaLevelhPa);
    }
    
    bool isAvailable() { return available; }

private:
    Adafruit_BMP280 bmp; // I2C
    bool available = false;

    BarometerManager() {}
};
