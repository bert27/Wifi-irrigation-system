#pragma once
#include <Arduino.h>

/**
 * @brief Tarea programada de riego.
 * Representa un horario específico para activar el sistema de riego.
 */
struct IScheduledTask {
    String days;        // Días de la semana (formato array JSON o string)
    String hour;        // Hora de activación (formato "HH")
    String minute;      // Minuto de activación (formato "MM")
};
