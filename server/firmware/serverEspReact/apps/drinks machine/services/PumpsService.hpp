#pragma once
#include <Arduino.h>
#include "MenuService.hpp"
#include "../config.hpp"

class PumpsService {
public:
    static PumpsService& getInstance() {
        static PumpsService instance;
        return instance;
    }

    void begin() {
        offAllPumps();
    }

    void offAllPumps() {
        int pins[] = {PIN_PUMP_1, PIN_PUMP_2, PIN_PUMP_3, PIN_PUMP_4};
        for(int p : pins) {
            pinMode(p, OUTPUT);
            analogWrite(p, 0); 
        }
    }

    // Calculates total duration by summing sequential ingredient times
    unsigned long calculateServingDuration(const MenuEntry& entry) {
        unsigned long totalTime = 0;
        
        Serial.printf("\n[Pumps] --- Analyzing Recipe (Sequential): %s ---\n", entry.name.c_str());

        if (entry.index >= 0 && entry.index < (int)MenuService::getInstance().cocktails.size()) {
            const auto& recipe = MenuService::getInstance().cocktails[entry.index].ingredients;
            const auto& bottles = MenuService::getInstance().bottles;

            for (const auto& ing : recipe) {
                bool matched = false;
                for (const auto& b : bottles) {
                    if (b.liquid == ing.name) {
                        float ratePerMl = b.timeCalibration / 20.0f;
                        unsigned long durationMs = (unsigned long)(ing.quantity * ratePerMl * 1000.0f);
                        
                        Serial.printf(" - %s: %dml (Pump %d, %.2fs/20ml) -> Duration: %lums\n", 
                                      ing.name.c_str(), ing.quantity, b.id, b.timeCalibration, durationMs);
                        
                        totalTime += durationMs;
                        matched = true;
                        break;
                    }
                }
                if (!matched) {
                    Serial.printf(" ! Warning: No pump assigned for '%s'\n", ing.name.c_str());
                }
            }
            
            // Safety limit (4 minutes for sequential)
            if (totalTime == 0 || totalTime > 240000) {
                Serial.printf(" ! Unusual duration calculated (%lums). Forcing to 3000ms for safety.\n", totalTime);
                totalTime = 3000; 
            }
        } else {
            Serial.println(" ! Error: Invalid recipe index.");
            totalTime = 3000;
        }

        Serial.printf("[Pumps] Total sequence duration: %lums\n\n", totalTime);
        return totalTime;
    }

    void processPumps(bool isServing, const MenuEntry& entry, unsigned long elapsed) {
        if (!isServing) {
            offAllPumps();
            return;
        }

        if (entry.index < 0 || entry.index >= (int)MenuService::getInstance().cocktails.size()) return;

        const auto& recipe = MenuService::getInstance().cocktails[entry.index].ingredients;
        const auto& bottles = MenuService::getInstance().bottles;

        unsigned long cumulativeTime = 0;
        bool anyPumpActive = false;

        for (const auto& ing : recipe) {
            bool found = false;
            for (const auto& b : bottles) {
                if (b.liquid == ing.name) {
                    float ratePerMl = b.timeCalibration / 20.0f;
                    unsigned long durationMs = (unsigned long)(ing.quantity * ratePerMl * 1000.0f);
                    
                    if (!anyPumpActive && elapsed >= cumulativeTime && elapsed < (cumulativeTime + durationMs)) {
                        analogWrite(b.gpio, b.pwm);
                        anyPumpActive = true;
                    } else {
                        analogWrite(b.gpio, 0);
                    }
                    cumulativeTime += durationMs;
                    found = true;
                    break;
                }
            }
        }

        if (!anyPumpActive) {
            offAllPumps();
        }
    }

private:
    PumpsService() {}
};
