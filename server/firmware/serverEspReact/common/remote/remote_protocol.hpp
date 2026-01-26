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

struct PumpSyncData {
    int pwm[4];
    float calibration[4];
};

struct RecipeSyncData {
    uint8_t index;
    uint8_t total;
    char name[32];
    uint16_t ingredientsMl[4]; // [0]=Pump1, [1]=Pump2...
};

enum ActionType {
    REMOTE_CMD_DRINK_ORDER = 99,
    REMOTE_CMD_SYNC_REQUEST = 100,
    REMOTE_CMD_SYNC_RESPONSE = 101,
    REMOTE_CMD_RECIPE_SYNC_REQUEST = 102,
    REMOTE_CMD_RECIPE_DATA = 103,
    REMOTE_CMD_PUMP_UPDATE = 104,
    REMOTE_CMD_RECIPE_UPDATE = 105,
    // Legacy/Other inputs
    REMOTE_CMD_JOYSTICK = 1,
    REMOTE_CMD_GYRO = 2
};

typedef struct __attribute__((packed)) struct_message {
    int id;
    float temp;
    int idReading;
    union {
        struct {
            char choose[96];      // Command from joystick (aligned)
            char giroscope[96];    // Command from gyro (aligned)
        };
        PumpSyncData pumpValues;   // Used for ID 101 (Sync Response)
        RecipeSyncData recipeData; // Used for ID 103 (Recipe Data)
    };
    ValuesGiroscope giroscopeValues;
    JoystickData joystickValues;
} struct_message;
