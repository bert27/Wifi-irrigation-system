# RobotCore - Ecosistema Modular IoT (ESP8266 / ESP32 + React)

🇺🇸 **[Read in English](README.md)** | 🇪🇸 **[Leer en Español](README_es.md)**

[![Firmware Pantalla](https://img.shields.io/badge/Descargar_Firmware_Pantalla-Robot_Core_Display-orange?style=flat&logo=espressif)](https://github.com/Albert-Benavent-Cabrera/Robot-Core-Display)

## 🌟 Descripción del Proyecto

Este proyecto es un **ecosistema multi-aplicación** que integra hardware y software para el control unificado de dispositivos IoT mediante una interfaz web moderna en **React**.

Desarrollado con una arquitectura híbrida, combina la eficiencia de los chips **ESP8266** (para los dispositivos de actuación) con la potencia del **ESP32** (para el Mando Físico), permitiendo gestionar **múltiples aplicaciones** independientes desde un mismo código base:

1.  **Robot Car**: Vehículo teledirigido con telemetría.
2.  **Cocktail Machine**: Dispensador automático de bebidas.
3.  **Irrigation System**: Control de riego inteligente.

> **🌐 [Visita RobotCore](https://robot-core.vercel.app/)**

---

## 🎨 Interfaz Cyberpunk

El dashboard cuenta con un diseño **cyberpunk de alta calidad** con efectos de glassmorphism, neon glows y animaciones fluidas.

### 🤖 RobotCore Dashboard

![RobotCore](./client/public/car/screenshot.png?v=1)

Control completo del robot con:
- **Neural Telemetry**: Visualización de giroscopio MPU en tiempo real
- **RGB Module**: Selector de color con preview y efectos de glow
- **Kinetic Control**: D-pad para control direccional con indicadores de estado
- **Actuators**: Panel de control de pines y outputs

### 🌿 Sistema de Riego

![Sistema de Riego](./client/public/plant/screenshot.png?v=1)

Automatización de riego inteligente:
- **Status Actual**: Temperatura y hora ESP en tiempo real
- **Programación**: Gestión de tareas por días y horarios
- **Configuración**: Selector de días y hora para nuevas tareas
- **Control Manual**: Ajustes directos de bombas

### �🍹 Cocktail Mixer 3000

![Cocktail Machine](./client/public/drinks/screenshot.png)

Sistema automatizado de mezcla de bebidas:
- **Grid de bebidas**: Selección rápida con efectos visuales premium
- **Configuración de bombas**: Control PWM y calibración de tiempo
- **Control manual**: D-pad para activación individual de bombas

---

## 🛠️ Tecnologías Utilizadas

### Frontend
- **React (v19+)**: Interfaz dinámica y reactiva.
- **Vite**: Sistema de construcción ultra rápido (Sustituyendo a CRA).
- **TypeScript**: Robustez y tipado estático con alias `@/`.
- **Material UI (MUI)**: Sistema de diseño moderno.
- **WebSocket**: Comunicación en tiempo real de baja latencia.
- **Clean Code Architecture**: Separación en Models, Hooks y Components.

### Backend / Firmware
- **ESP8266 Core for Arduino**: Firmware optimizado para el chip ESP8266.
- **AsyncWebServer**: Servidor HTTP asíncrono para ESP8266.
- **Node.js (Mock Server)**: Para desarrollo local sin necesidad del chip físico.

---

## 🏗️ Estructura del Proyecto

El repositorio está organizado de forma modular para facilitar el mantenimiento y escalabilidad:

- `/client`: Aplicación frontend en React + Vite (Cyberpunk Dashboard).
- `/remote-control`: Firmware para el **Mando Físico (ESP32)** con soporte para joystick, giroscopio y telemetría directa.
- `/server/firmware`: Código fuente modular para el **Robot (ESP8266/ESP32)**.
    - `/apps/robot car`: Lógica de control de motores y giroscopio interno.
    - `/apps/drinks machine`: Gestión de bombas, recetas y pantalla OLED.
    - `/apps/irrigation`: Programación horaria y tareas de riego.
    - `/utils`: Componentes compartidos y Hub de comunicación.

---

## ⚙️ Configuración Modular (AppConfig)

El firmware del ESP8266 (`/server/firmware/serverEspReact`) es modular por diseño. Puedes elegir qué "personalidad" quieres cargar en el robot editando un solo archivo.

Esto evita conflictos de librerías (ej: usar librerías de riego cuando solo quieres la máquina de bebidas) y ahorra memoria.

### Cómo activar/desactivar módulos

1.  Abre el archivo `server/firmware/serverEspReact/AppConfig.h`.
2.  Descomenta (`//`) solo el módulo que quieras compilar.

Ejemplo para activar **solo la Máquina de Bebidas**:

```cpp
#define ENABLE_DRINKS_MACHINE
// #define ENABLE_IRRIGATION_SYSTEM
// #define ENABLE_ROBOT_CAR
```

**⚠️ Nota Importante**: Si intentas activar todos los módulos a la vez, podrías tener errores de compilación debido a conflictos de versiones de librerías (especialmente ArduinoJson). Se recomienda compilar y subir **un solo módulo activo** cada vez.

## 🎮 Arquitectura de Red y Control Multi-Dispositivo

Este sistema no se conecta a un solo servidor, sino que orquesta una red de dispositivos distribuidos, combinando tecnologías según la naturaleza de los datos:

### 📡 WebSockets vs HTTP (Endpoints)

El Frontend de React utiliza una arquitectura híbrida:

1.  **WebSockets (Telemetría en Tiempo Real)**
    *   **¿Por qué?** Para datos de flujo continuo y crítico como el **Giroscopio (Joystick/Robot)**.
    *   **Funcionamiento**: Se abre un "tubo" permanente. El ESP32 "empuja" miles de datos por segundo sin que el navegador tenga que pedirlo.
    *   **Latencia**: Mínima (<10ms), permitiendo ver gráficos fluidos que reaccionan al milisegundo.
    *   **Implementación**: `RemoteControlContext` mantiene una conexión global para que el mando físico funcione en cualquier pantalla.

2.  **HTTP/REST (Comandos)**
    *   **¿Por qué?** Para acciones puntuales y confirmadas como **"Encender Bomba"**, **"Cambiar Color"** o **"Guardar Configuración"**.
    *   **Funcionamiento**: El navegador hace una petición puntual (GET/POST) y espera confirmación ("OK").
    *   **Seguridad**: Asegura que una orden (ej: regar) se ha recibido y procesado correctamente.

### 🔗 Mapa de Conexiones

El sistema gestiona 4 IPs simultáneas, permitiendo que cada módulo tenga su propio cerebro pero opere bajo una misma interfaz unificada:

| Dispositivo | Variable `.env` | Hostname mDNS | Función Principal | Protocolo |
| :--- | :--- | :--- | :--- | :--- |
| **Robot Car** | `VITE_ROBOT_IP` | `robot-car.local` | Movimiento, Motores, Luces | HTTP + WebSocket |
| **Mando Remoto** | `VITE_REMOTE_IP` | `remote-control.local` | Joystick Físico, Giroscopio externo | WebSocket Global |
| **Máquina Bebidas**| `VITE_DRINKS_IP`| `drinks-machine.local` | Bombas peristálticas, Pantalla OLED | HTTP + WebSocket |
| **Sistema Riego** | `VITE_IRRIGATION_IP`| `irrigation-system.local` | Gestión hídrica, Calendario | HTTP |

### 📶 Comunicación Híbrida (ESP-NOW)
Además del WiFi, el **Mando Remoto** habla directamente con el **Robot** usando **ESP-NOW** (protocolo de radio directo de Espressif). Esto permite controlar el robot en exteriores sin necesidad de Router ni WiFi, mientras que si hay WiFi disponible, ambos dispositivos reportan sus datos a la web simultáneamente.

---

## 🚀 Instalación y Ejecución

### Opción Rápida (Scripts de un solo clic)
He creado scripts para facilitar el inicio del proyecto (instala dependencias y lanza los servidores):

- **Mac/Linux:**
  ```bash
  ./run-mac.sh
  ```
- **Windows:**
  Doble clic en `run-windows.bat` o `run-windows.bat` desde la terminal.

---

4. **Modo Simulación (Mock)**:
   - Si no tienes el robot físico contigo, puedes activar el modo simulación para ver la UI funcionando con datos falsos.
   - En el archivo `client/.env`, cambia `VITE_MOCK_SERVER=true`.
   - Esto también se activa automáticamente si despliegas en Vercel (HTTPS) para evitar errores de conexión segurida.

1. Abre el archivo en `/server/firmware` (Robot) o `/remote-control/firmware` (Mando).
> **Nota para ESP32**: Si usas una placa ESP32, asegúrate de tener esta URL en *Arduino IDE -> Preferences -> Additional Board Manager URLs*:
> `https://espressif.github.io/arduino-esp32/package_esp32_index.json`
>
> ⚠️ **Solución de problemas**: Si la instalación de la versión más reciente falla (error `DEADLINE_EXCEEDED` o similar), intenta instalar la versión **2.0.17** desde el Gestor de Tarjetas.

1. Abre el archivo en `/server/firmware` (Robot) o `/remote-control/firmware` (Mando).
2. **Configuración de Secretos**:
   - Este proyecto requiere **dos** archivos `secrets.h` (uno para el mando, otro para el robot).
   - En cada carpeta de firmware (`server/firmware/serverEspReact/` y `remote-control/firmware/remote-control/`), encontrarás un `secrets_example.h`.
   - Renómbralos a `secrets.h` y rellena tus credenciales WiFi y MACs.
3. Carga el sketch a tus dispositivos.

### ⚠️ Importante: Problemas de Conexión WiFi
Si el frontend no conecta con el ESP32 (error `ws: connection failed` o `No route to host`) y usas mDNS (`remote-control.local`), verifica esto:

1.  **Navegador y Mixed Content (Error comunes en Vercel/HTTPS)**:
    *   **Problema**: Si despliegas esta web en Vercel (`https://...`), el navegador bloqueará la conexión al ESP32 (`ws://...`) por seguridad ("Mixed Content"). Verás un mensaje de error rojo en la aplicación.
    *   **Solución Recomendada**: Ejecuta el cliente **localmente** (`npm run dev`) en tu ordenador. Desde `http://localhost`, la conexión al robot funciona perfectamente.
    *   **Solución Alternativa (Difícil)**: Configurar Chrome para permitir contenido inseguro (`chrome://flags/#block-insecure-private-network-requests`), aunque esto no siempre funciona para WebSockets desde dominios públicos HTTPS.
2.  **mDNS en Windows/Android**: `.local` funciona nativamente en Apple (Mac/iPhone). En Windows necesitas tener instalado Bonjour (viene con iTunes) o usar la IP directa en lugar de `remote-control.local`.
3.  **Firewall**: A veces el firewall del ordenador bloquea las conexiones entrantes/salientes al puerto 80 del ESP32.

---

## 📋 Características Implementadas

### Dashboard & Mando Físico
- Control inalámbrico de largo alcance (ESP-NOW)
- Telemetría directa desde el mando a la Web (WebSocket `/ws/remote`)
- Visualización 3D del giroscopio del mando en tiempo real
- Control híbrido Web/Físico sin interrupciones

### Módulo Robot Car
- Control de motores de alta frecuencia
- Telemetría interna de inclinación (Pitch/Roll)
- Efectos de iluminación RGB sincronizados
- Comunicación directa con Mando Remoto (ESP-NOW)

### Cocktail Mixer & Drinks
- Interfaz física en pantalla OLED (Menú autónomo)
- Selección de bebidas desde el mando (Joystick Up/Down/Accept)
- API de control remoto y visualización en dashboard

### Sistema de Riego Inteligente
- Control manual de bombas de agua (ON/OFF)
- Programación de tareas de riego por días y horas
- Telemetría de humedad y temperatura DHT22 simulada/real
- Sincronización horaria automática (NTP)

