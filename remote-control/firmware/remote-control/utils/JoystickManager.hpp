#pragma once
#include "config.h"

struct JoystickValues {
    String direction;
    String buttonState;
};

class JoystickManager {
public:
    static JoystickManager& getInstance() {
        static JoystickManager instance;
        return instance;
    }

    void begin() {
        pinMode(PIN_JOY_BTN, INPUT);
    }

    JoystickValues getValues() {
        int x = analogRead(PIN_JOY_X);
        int y = analogRead(PIN_JOY_Y);
        int btn = analogRead(PIN_JOY_BTN);

        JoystickValues values;
        values.direction = "Sin Movimiento";

        if (x < JOY_THRESHOLD_DOWN) values.direction = "Arriba";
        else if (x > JOY_THRESHOLD_UP) values.direction = "Abajo";
        else if (y > JOY_THRESHOLD_UP) values.direction = "Derecha";
        else if (y < JOY_THRESHOLD_DOWN) values.direction = "Izquierda";

        // Button Logic: Assuming Pull-UP (Pressed = ~0V, Released = ~4095V)
        // If Pin 34 is floating, this might be unstable without external resistor.
        // Button Logic: Hard Inverted or Pull-Down?
        // User requested to send "on" when we were previously sending "off".
        // Previously: < 2500 = "on", >= 2500 = "off".
        // New: > 2500 = "on" (Active High).
        values.buttonState = (btn > 2500) ? "on" : "off";

        return values;
    }

private:
    JoystickManager() {}
};
