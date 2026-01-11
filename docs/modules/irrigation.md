# Irrigation Module

## Overview
The Irrigation module is the core of the server, managing HTTP routes, water pumps, and time scheduling.

## Implementation
- **File**: `server/firmware/apps/plant/controller.hpp` (formerly `irrigation_system_clock.hpp`)
- **Class**: `IrrigationSystem` (Singleton)
- **Dependecies**: `ds3231.hpp` (RTC Manager), `ESPAsyncWebServer`

## Core Responsibilities
1. **Web Server**: Initializes the `AsyncWebServer` on port 80.
2. **Water Pumps**: Controls 1 PWM-enabled pin for irrigation (`PIN_IRRIGATION_PUMP`).
3. **RTC Clock**: Uses `DS3231Manager` for time syncing.
4. **Task Scheduling**: Maintains a list of scheduled irrigation tasks (Day/Hour/Minute).

## API Endpoints
- `GET /waterPump1OnOFF`: Direct pump control (PWM).
- `GET /getClock`: Returns current RTC time.
- `GET /getList`: Returns formatted list of schedules.
- `GET /addTaskEsp`: Adds a new irrigation task.
- `GET /getTemperature`: Returns ambient temperature from RTC.
