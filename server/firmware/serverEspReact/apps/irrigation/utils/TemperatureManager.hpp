#pragma once
#include "ds3231.hpp"
#include <Arduino.h>

/**
 * Gestor de Temperatura para el sistema de riego.
 * Actualmente utiliza el sensor interno del DS3231, pero está diseñado
 * para ser extendido a otros sensores (DHT11/22, DS18B20) si es necesario.
 */
class TemperatureManager {
public:
    static TemperatureManager& getInstance() {
        static TemperatureManager instance;
        return instance;
    }

    /**
     * Obtiene la temperatura actual en grados Celsius.
     */
    float getTemperature() {
        return DS3231Manager::getInstance().getTemperature();
    }

    /**
     * Retorna la temperatura formateada como String (ej: "25.50 °C").
     */
    String getFormattedTemperature() {
        char buffer[10];
        dtostrf(getTemperature(), 4, 2, buffer);
        return String(buffer) + " °C";
    }

private:
    TemperatureManager() {}
};
