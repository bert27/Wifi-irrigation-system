#pragma once
#include <Arduino.h>

// Shared Remote Data Structures
// Must be binary compatible with the remote-control project

struct ValuesGiroscope {
    float X;
    float Y;
};

struct JoystickData {
    String buttonState;
    String direction;
};

typedef struct struct_message {
    int id;
    float temp;
    int idReading;
    char choose[85];      // Command from joystick
    char giroscope[85];    // Command from gyro
    ValuesGiroscope giroscopeValues;
    JoystickData joystickValues;
} struct_message;
