# Gyroscope Module

## Overview
The Gyroscope module manages the **MPU6050** sensor to provide real-time telemetry data (Pitch & Roll) to the Neural Dashboard.

## Implementation
- **File**: `server/firmware/apps/gyroscope.hpp`
- **Class**: `GyroscopeManager` (Singleton)
- **Library**: `Wire.h` (I2C)

## Functionality
1. **Initialization**: Configures the MPU6050 power management to wake it up.
2. **Data Reading**: Reads 14 bytes from the I2C bus (Accelerometer, Temperature, Gyroscope).
3. **Processing**: Calculates Pitch and Roll angles using accelerometer data.
4. **Output**: Returns a JSON string `{"giroscopeValues": [pitch, roll]}` for easy consumption by the frontend.

## Usage
Called in `serverEspReact.ino`:
```cpp
setupGyroscope(); // In setup()
// Data is polled via getGyroscopeData() when needed
```
