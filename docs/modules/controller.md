# Encoder Module

## Overview
The Encoder module handles the physical user interface interaction using a Rotary Encoder with a push button. It manages the cocktail selection menu and navigation.

## Implementation
- **File**: `server/firmware/apps/drinks/controller.hpp`
- **Class**: `EncoderManager` (Singleton)
- **Library**: `BfButton`

## Hardware Configuration
- **CLK Pin**: 13
- **DT Pin**: 12
- **Button Pin**: 14

## Navigation Logic
The system uses a state machine with "Screens":
- **Screen 0**: Main Menu (Scroll drinks)
- **Screen 1**: Confirmation ("Aceptar?")
- **Screen 2**: Action ("Sirviendo")

## Key Features
- **Rotary Input**: Increments/Decrements counter to scroll through liquids.
- **Button Input**:
    - **Single Click**: Select / Confirm.
    - **Double Click**: Reset Menu.
    - **Long Press**: Reset Menu.
