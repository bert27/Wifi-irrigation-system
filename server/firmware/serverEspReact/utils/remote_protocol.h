#pragma once
#include <Arduino.h>

// Shared Remote Data Structures
// Must be binary compatible with the remote-control project

struct ValuesGiroscope {
    float X;
    float Y;
};

struct JoystickData {
    char buttonState[16];
    char direction[16];
};

typedef struct __attribute__((packed)) struct_message {
    int id;
    float temp;
    int idReading;
    char choose[96];      // Command from joystick (aligned)
    char giroscope[96];    // Command from gyro (aligned)
    ValuesGiroscope giroscopeValues;
    JoystickData joystickValues;
} struct_message;
