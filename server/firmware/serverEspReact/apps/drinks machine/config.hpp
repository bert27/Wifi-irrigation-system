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
 * @brief Configuración inicial de las botellas/bombas.
 */
static std::vector<IBottle> DEFAULT_BOTTLES = {
    { 1, "Bomba 1", "Cocacola", 255, 5000, PIN_PUMP_1 },
    { 2, "Bomba 2", "Zumo de naranja", 255, 5000, PIN_PUMP_2 },
    { 3, "Bomba 3", "Vodka", 255, 5000, PIN_PUMP_3 },
    { 4, "Bomba 4", "Granadina", 255, 5000, PIN_PUMP_4 }
};

/**
 * @brief Cócteles por defecto del sistema.
 * Cantidades en ml, proporciones realistas de coctelería.
 */
static std::vector<ICocktail> DEFAULT_COCKTAILS = {
    // Bebidas simples (200ml)
    { "Cocacola", {{ "Cocacola", 200 }} },
    { "Zumo de naranja", {{ "Zumo de naranja", 200 }} },
    { "Vodka shot", {{ "Vodka", 50 }} },
    
    // Cócteles clásicos
    { "Vodka con cocacola", {{ "Vodka", 50 }, { "Cocacola", 150 }} },  // Cubata clásico
    { "Destornillador", {{ "Vodka", 50 }, { "Zumo de naranja", 150 }} },  // Screwdriver
    { "Sex on the beach", {{ "Vodka", 40 }, { "Zumo de naranja", 120 }, { "Granadina", 40 }} },
    { "Tequila sunrise", {{ "Zumo de naranja", 150 }, { "Granadina", 50 }} },  // Sin tequila, versión mocktail
    { "Shirley Temple", {{ "Cocacola", 150 }, { "Granadina", 50 }} }  // Mocktail clásico
};
