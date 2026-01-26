#pragma once
#include <Arduino.h>
#include <vector>

/**
 * @brief Structure representing a bottle/pump of the machine.
 * Synchronized with IBottle from the frontend.
 */
struct IBottle {
    int id;                 // Numeric ID (1, 2, 3...)
    String title;           // Visual title (e.g., "Pump 1")
    String liquid;          // Name of the contained liquid
    int pwm = 255;          // Pump speed (PWM)
    float timeCalibration = 1.0f; // Time calibration (Seconds per Unit/ML)
    int gpio;               // Physical GPIO pin connected to the pump
};

/**
 * @brief Property of a liquid within a recipe.
 */
struct ILiquidProp {
    String name;
    int quantity;
};

/**
 * @brief Structure of a cocktail.
 * Synchronized with ICocktail/IHardwareCocktail.
 */
struct ICocktail {
    String name;
    std::vector<ILiquidProp> ingredients;
};
