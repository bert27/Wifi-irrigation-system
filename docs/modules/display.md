# Display Module

## Overview
The Display module controls the **SSD1306 OLED Screen** (128x64) to show the user interface, including cocktail logos, menus, and status messages.

## Implementation
- **File**: `server/firmware/apps/display.hpp`
- **Class**: `DisplayManager` (Singleton)
- **Libraries**: `Adafruit_GFX`, `Adafruit_SSD1306`

## Functionality
- **Boot**: Shows a splash screen/logo.
- **Menu Rendering**: Displays text for current selection (e.g., "Agua", "Cocacola").
- **API Control**: Exposure of `/control` endpoint for remote testing of display states.

## Assets
Bitmaps are stored in PROGMEM (`DisplayAssets` namespace) to save RAM.
