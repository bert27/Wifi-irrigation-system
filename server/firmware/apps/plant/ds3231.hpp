#pragma once

#include <RTClib.h>

class DS3231Manager {
public:
    static DS3231Manager& getInstance() {
        static DS3231Manager instance;
        return instance;
    }

    void begin() {
        if (!rtc.begin()) {
            Serial.println("Couldn't find RTC");
            Serial.flush();
            rtc.adjust(DateTime((__DATE__), (__TIME__)));
        }

        if (rtc.lostPower()) {
            Serial.println("RTC lost power, let's set the time!");
            rtc.adjust(DateTime(F(__DATE__), F(__TIME__)));
        }
    }

    String getClockString() {
        DateTime now = rtc.now();
        char buffer[25];
        snprintf(buffer, sizeof(buffer), "%02d:%02d:%02d %02d/%02d/%04d", 
                 now.hour(), now.minute(), now.second(), 
                 now.day(), now.month(), now.year());
        return String(buffer);
    }

    float getTemperature() {
        return rtc.getTemperature();
    }

private:
    RTC_DS3231 rtc;

    DS3231Manager() {}
};
