#pragma once
#include <Arduino.h>
#include <vector>
#include "models.hpp"

// --- Pump Pin Definitions ---
static constexpr uint8_t PIN_PUMP_1 = 0;
static constexpr uint8_t PIN_PUMP_2 = 2;
static constexpr uint8_t PIN_PUMP_3 = 16;
static constexpr uint8_t PIN_PUMP_4 = 15;

// --- Encoder Pin Definitions ---
static constexpr uint8_t PIN_ENC_BTN = 14; // D5
static constexpr uint8_t PIN_ENC_DT = 12;  // D6
static constexpr uint8_t PIN_ENC_CLK = 13; // D7

// --- mDNS Configuration ---
static constexpr const char* MDNS_HOSTNAME = "drinks-machine";

/**
 * @brief Default pump and bottle configurations.
 */
inline std::vector<IBottle> getDefaultBottles() {
    return {
        { 1, "Pump 1", "Cocacola", 255, 5.0f, PIN_PUMP_1 },
        { 2, "Pump 2", "Orange Juice", 255, 5.0f, PIN_PUMP_2 },
        { 3, "Pump 3", "Vodka", 255, 5.0f, PIN_PUMP_3 },
        { 4, "Pump 4", "Grenadine", 255, 5.0f, PIN_PUMP_4 }
    };
}

/**
 * @brief Default system cocktails.
 */
inline std::vector<ICocktail> getDefaultCocktails() {
    return {
        // Simple drinks (200ml)
        { "Cocacola", {{ "Cocacola", 200 }} },
        { "Orange Juice", {{ "Orange Juice", 200 }} },
        { "Vodka shot", {{ "Vodka", 50 }} },
        
        // Classic Cocktails
        { "Vodka with Cocacola", {{ "Vodka", 50 }, { "Cocacola", 150 }} },
        { "Screwdriver", {{ "Vodka", 50 }, { "Orange Juice", 150 }} },
        { "Sex on the beach", {{ "Vodka", 40 }, { "Orange Juice", 120 }, { "Grenadine", 40 }} },
        { "Tequila sunrise", {{ "Orange Juice", 150 }, { "Grenadine", 50 }} },
        { "Shirley Temple", {{ "Cocacola", 150 }, { "Grenadine", 50 }} }
    };
}
