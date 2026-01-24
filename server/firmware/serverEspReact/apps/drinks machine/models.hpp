#pragma once
#include <Arduino.h>
#include <vector>

/**
 * @brief Estructura que representa una botella/bomba de la máquina.
 * Sincronizada con IBottle del frontend.
 */
struct IBottle {
    int id;                 // ID numérico (1, 2, 3...)
    String title;           // Título visual (ej: "Bomba 1")
    String liquid;          // Nombre del líquido contenido
    int pwm = 255;          // Velocidad de la bomba
    float timeCalibration = 1.0f; // Calibración de tiempo (Seconds per Unit/ML)
    int gpio;               // Pin físico al que está conectada
};

/**
 * @brief Propiedad de un líquido en una receta.
 */
struct ILiquidProp {
    String name;
    int quantity;
};

/**
 * @brief Estructura de un cóctel.
 * Sincronizada con ICocktail/IHardwareCocktail.
 */
struct ICocktail {
    String name;
    std::vector<ILiquidProp> ingredients;
};
