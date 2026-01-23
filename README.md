# RobotCore - Modular IoT Ecosystem (ESP8266 / ESP32 + React)

🇺🇸 **[Read in English](README.md)** | 🇪🇸 **[Leer en Español](README_es.md)**

## 🌟 Project Description

This project is a **multi-application ecosystem** that integrates hardware and software for unified IoT device control through a modern **React** web interface.

Developed with a hybrid architecture, it combines the efficiency of **ESP8266** chips (for actuation devices) with the power of the **ESP32** (for the Physical Remote Control), allowing the management of **multiple independent applications** from the same codebase:

1.  **Robot Car**: Remote-controlled vehicle with telemetry.
2.  **Cocktail Machine**: Automatic drink dispenser.
3.  **Irrigation System**: Smart irrigation control.

> **🌐 [Visit RobotCore](https://robot-core.vercel.app/)**

---

## 🎨 Cyberpunk Interface

The dashboard features a **high-quality cyberpunk design** with glassmorphism effects, neon glows, and fluid animations.

### 🤖 RobotCore Dashboard

![RobotCore](./client/public/car/screenshot.png?v=1)

Complete robot control with:
- **Neural Telemetry**: Real-time MPU gyroscope visualization
- **RGB Module**: Color selector with preview and glow effects
- **Kinetic Control**: D-pad for directional control with status indicators
- **Actuators**: Pin and output control panel

### 🌿 Irrigation System

![Irrigation System](./client/public/plant/screenshot.png?v=1)

Smart irrigation automation:
- **Current Status**: Real-time temperature and ESP clock
- **Scheduling**: Task management by days and times
- **Configuration**: Day and time selector for new tasks
- **Manual Control**: Direct pump adjustments

### 🍹 Cocktail Mixer 3000

![Cocktail Machine](./client/public/drinks/screenshot.png)

Automated drink mixing system:
- **Drinks Grid**: Quick selection with premium visual effects
- **Pump Configuration**: PWM control and time calibration
- **Manual Control**: D-pad for individual pump activation

---

## 🛠️ Technologies Used

### Frontend
- **React (v19+)**: Dynamic and reactive interface.
- **Vite**: Ultra-fast build system (replacing CRA).
- **TypeScript**: Robustness and static typing with `@/` alias.
- **Material UI (MUI)**: Modern design system.
- **WebSocket**: Low-latency real-time communication.
- **Clean Code Architecture**: Separation into Models, Hooks, and Components.

### Backend / Firmware
- **ESP8266 Core for Arduino**: Optimized firmware for ESP8266 chip.
- **AsyncWebServer**: Asynchronous HTTP server for ESP8266.
- **Node.js (Mock Server)**: For local development without physical hardware.

---

## 🏗️ Project Structure

The repository is organized modularly to facilitate maintenance and scalability:

- `/client`: React + Vite frontend application (Cyberpunk Dashboard).
- `/remote-control`: Firmware for **Physical Remote Control (ESP32)** with joystick, gyroscope, and direct telemetry support.
- `/server/firmware`: Modular source code for **Robot (ESP8266/ESP32)**.
    - `/apps/robot car`: Motor control and internal gyroscope logic.
    - `/apps/drinks machine`: Pump management, recipes, and OLED display.
    - `/apps/irrigation`: Schedule programming and irrigation tasks.
    - `/utils`: Shared components and Communication Hub.

---

## ⚙️ Modular Configuration (AppConfig)

The ESP8266 firmware (`/server/firmware/serverEspReact`) is modular by design. You can choose which "personality" to load on the robot by editing a single file.

This avoids library conflicts (e.g., using irrigation libraries when you only want the drinks machine) and saves memory.

### How to enable/disable modules

1.  Open the file `server/firmware/serverEspReact/AppConfig.h`.
2.  Uncomment (`//`) only the module you want to compile.

Example to activate **only the Drinks Machine**:

```cpp
#define ENABLE_DRINKS_MACHINE
// #define ENABLE_IRRIGATION_SYSTEM
// #define ENABLE_ROBOT_CAR
```

**⚠️ Important Note**: If you try to activate all modules at once, you might encounter compilation errors due to library version conflicts (especially ArduinoJson). It's recommended to compile and upload **one active module at a time**.

## 🎮 Network Architecture and Multi-Device Control

This system doesn't connect to a single server but orchestrates a network of distributed devices, combining technologies according to data nature:

### 📡 WebSockets vs HTTP (Endpoints)

The React Frontend uses a hybrid architecture:

1.  **WebSockets (Real-Time Telemetry)**
    *   **Why?** For continuous and critical data flow like **Gyroscope (Joystick/Robot)**.
    *   **How it works**: A permanent "tube" is opened. The ESP32 "pushes" thousands of data points per second without the browser having to request them.
    *   **Latency**: Minimal (<10ms), allowing smooth graphics that react to the millisecond.
    *   **Implementation**: `RemoteControlContext` maintains a global connection so the physical remote works on any screen.

2.  **HTTP/REST (Commands)**
    *   **Why?** For specific and confirmed actions like **"Turn on Pump"**, **"Change Color"**, or **"Save Configuration"**.
    *   **How it works**: The browser makes a one-time request (GET/POST) and waits for confirmation ("OK").
    *   **Security**: Ensures an order (e.g., irrigation) has been received and processed correctly.

### 🔗 Connection Map

The system manages 4 IPs simultaneously, allowing each module to have its own brain but operate under a single unified interface:

| Device | `.env` Variable | mDNS Hostname | Main Function | Protocol |
| :--- | :--- | :--- | :--- | :--- |
| **Robot Car** | `VITE_ROBOT_IP` | `robot-car.local` | Movement, Motors, Lights | HTTP + WebSocket |
| **Remote Control** | `VITE_REMOTE_IP` | `remote-control.local` | Physical Joystick, External Gyroscope | Global WebSocket |
| **Drinks Machine**| `VITE_DRINKS_IP`| `drinks-machine.local` | Peristaltic Pumps, OLED Display | HTTP + WebSocket |
| **Irrigation System** | `VITE_IRRIGATION_IP`| `irrigation-system.local` | Water Management, Calendar | HTTP |

### 📶 Hybrid Communication (ESP-NOW)
Additionally to WiFi, the **Remote Control** talks directly with the **Robot** using **ESP-NOW** (Espressif's direct radio protocol). This allows controlling the robot outdoors without Router or WiFi, while if WiFi is available, both devices simultaneously report their data to the web.

---

## 🚀 Installation and Execution

### Quick Option (One-Click Scripts)
I've created scripts to facilitate project startup (installs dependencies and launches servers):

- **Mac/Linux:**
  ```bash
  ./run-mac.sh
  ```
- **Windows:**
  Double-click `run-windows.bat` or run `run-windows.bat` from the terminal.

---

4. **Simulation Mode (Mock)**:
   - If you don't have the physical robot with you, you can activate simulation mode to see the UI working with fake data.
   - In the `client/.env` file, change `VITE_MOCK_SERVER=true`.
   - This also activates automatically if you deploy on Vercel (HTTPS) to avoid secure connection errors.

1. Open the file in `/server/firmware` (Robot) or `/remote-control/firmware` (Remote).
> **Note for ESP32**: If using an ESP32 board, make sure to have this URL in *Arduino IDE -> Preferences -> Additional Board Manager URLs*:
> `https://espressif.github.io/arduino-esp32/package_esp32_index.json`
>
> ⚠️ **Troubleshooting**: If the latest version installation fails (`DEADLINE_EXCEEDED` error or similar), try installing **version 2.0.17** from the Boards Manager.

1. Open the file in `/server/firmware` (Robot) or `/remote-control/firmware` (Remote).
2. **Secrets Configuration**:
   - This project requires **two** `secrets.h` files (one for the remote, another for the robot).
   - In each firmware folder (`server/firmware/serverEspReact/` and `remote-control/firmware/remote-control/`), you'll find a `secrets_example.h`.
   - Rename them to `secrets.h` and fill in your WiFi credentials and MACs.
3. Upload the sketch to your devices.

### ⚠️ Important: WiFi Connection Issues
If the frontend doesn't connect to the ESP32 (`ws: connection failed` or `No route to host` error) and you're using mDNS (`remote-control.local`), check this:

1.  **Browser and Mixed Content (Common errors on Vercel/HTTPS)**:
    *   **Problem**: If you deploy this web on Vercel (`https://...`), the browser will block the connection to ESP32 (`ws://...`) for security ("Mixed Content"). You'll see a red error message in the application.
    *   **Recommended Solution**: Run the client **locally** (`npm run dev`) on your computer. From `http://localhost`, the robot connection works perfectly.
    *   **Alternative Solution (Difficult)**: Configure Chrome to allow insecure content (`chrome://flags/#block-insecure-private-network-requests`), although this doesn't always work for WebSockets from public HTTPS domains.
2.  **mDNS on Windows/Android**: `.local` works natively on Apple (Mac/iPhone). On Windows you need to have Bonjour installed (comes with iTunes) or use the direct IP instead of `remote-control.local`.
3.  **Firewall**: Sometimes the computer's firewall blocks incoming/outgoing connections to ESP32's port 80.

---

## 📋 Implemented Features

### Dashboard & Physical Remote
- Long-range wireless control (ESP-NOW)
- Direct telemetry from remote to Web (WebSocket `/ws/remote`)
- 3D visualization of remote's gyroscope in real-time
- Hybrid Web/Physical control without interruptions

### Robot Car Module
- High-frequency motor control
- Internal tilt telemetry (Pitch/Roll)
- Synchronized RGB lighting effects
- Direct communication with Remote Control (ESP-NOW)

### Cocktail Mixer & Drinks
- Physical interface on OLED display (Standalone menu)
- Drink selection from remote (Joystick Up/Down/Accept)
- Remote control API and dashboard visualization

### Smart Irrigation System
- Manual water pump control (ON/OFF)
- Irrigation task programming by days and times
- DHT22 humidity and temperature telemetry (simulated/real)
- Automatic time synchronization (NTP)
