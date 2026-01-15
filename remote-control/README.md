# Mando a Distancia Físico (ESP32)

## Descripción General
Un mando a distancia portátil dedicado construido con un **ESP32** 38 PINES. Cuenta con un joystick físico y un giroscopio (compatible con **MPU6050** o **GY-91**) para un control dual del robot. Se comunica vía **ESP-NOW** para una latencia casi nula.
 
## 📦 Instalación de Dependencias (Firmware)
Este proyecto requiere dos librerías fundamentales que **no** están disponibles (o están desactualizadas) en el Gestor de Librerías estándar de Arduino. **Ambas son OBLIGATORIAS para el ESP32**:

1.  **ESPAsyncWebServer**: [Descargar ZIP](https://github.com/me-no-dev/ESPAsyncWebServer/archive/refs/heads/master.zip)
    *   *Qué hace*: Crea el servidor web asíncrono que permite la comunicación WebSockets de alto rendimiento sin bloquear el procesador.
2.  **AsyncTCP**: [Descargar ZIP](https://github.com/me-no-dev/AsyncTCP/archive/refs/heads/master.zip)
    *   *Qué hace*: Librería de bajo nivel para ESP32 que gestiona las conexiones TCP de forma asíncrona. Es el "motor" que necesita el servidor web para funcionar en este chip.

3.  **I2Cdev**: [Descargar ZIP](https://github.com/jrowberg/i2cdevlib/archive/refs/heads/master.zip)
    *   *Qué hace*: Abstracción I2C necesaria para el controlador del giroscopio.
    *   **Importante**: Dentro del ZIP, copia la carpeta `Arduino/I2Cdev` a tu carpeta `libraries`.
4.  **MPU6050**: (Incluido en el mismo ZIP de arriba)
    *   *Qué hace*: Controlador para leer el giroscopio MPU6050.
    *   **Instalación**: Del mismo ZIP de `I2Cdevlib`, copia la carpeta `Arduino/MPU6050` a tu carpeta `libraries`.
5.  **ArduinoJson**:
    *   *Qué hace*: Manejo eficiente de datos JSON para la telemetría.
    *   **Instalación**: Buscar "ArduinoJson" en el Gestor de Librerías.
6.  **Adafruit BMP280 Library**:
    *   *Qué hace*: Controlador para el barómetro del GY-91.
    *   **Instalación**: Buscar "Adafruit BMP280" en el Gestor (Instalar también dependencias si pregunta).


**Pasos:**
1. Descarga los ZIPs para las librerías 1-4.
2. Para `I2Cdev` y `MPU6050`, descomprime y mueve las carpetas manualmente a `Documents/Arduino/libraries/`.
3. Para `ArduinoJson`, instálala desde *Sketch -> Include Library -> Manage Libraries...*
3. En Arduino IDE: *Sketch -> Include Library -> Add .ZIP Library...* para el resto.

## Configuración de Hardware
| Componente | Pin | Función |
| :--- | :--- | :--- |
| **Joystick X** | 36 (VP) | Movimiento lateral |
| **Joystick Y** | 39 (VN) | Movimiento vertical |
| **Joystick SW**| 34 | Entrada de botón |
| **MPU6050 / GY-91 SDA**| 21 | Datos I2C (El GY-91 incluye MPU6050 + Magnetómetro + Barómetro BMP280) |
| **MPU6050 / GY-91 SCL**| 22 | Reloj I2C |
| **Batería** | 3.3V | Li-Po / Li-Ion |
| **Carga** | USB-C | Entrada 5V |
| **Boost DC-DC** | 3.3V -> 5V | Elevador de tensión para alimentar a 5v el esp32|

![Esquema Eléctrico](scheme.jpg)

## Sistema de Alimentación
El mando es totalmente portátil gracias a su sistema de gestión de energía:
1.  **Batería 3.3V**: Fuente de alimentación principal.
2.  **Interruptor**: Corte físico de energía.
3.  **DC-DC Boost**: Eleva los 3.3V de la batería a 5V estables para alimentar el pin 5v del ESP32.
4.  **Indicador de Batería**: Módulo de 4 LEDs para visualizar el nivel de carga restante.
5.  **Carga USB-C**: Puerto moderno para recargar la batería.

## Características Principales
- **Control Dual**: Joystick y Giroscopio (Compatible con MPU6050 estándar o módulos GY-91 avanzados).
- **Control Offline**: Comunicación de baja latencia vía **ESP-NOW** sin necesidad de WiFi.
- **Telemetría Directa**: Servidor de WebSockets integrado para enviar datos a React en tiempo real (`/ws`).
- **Arranque Híbrido**: El hardware y el control ESP-NOW arrancan instantáneamente; la conexión WiFi se gestiona en segundo plano sin bloquear el uso.

## ⚙️ Configuración (Importante)
El proyecto utiliza un archivo `secrets.h` para gestionar las credenciales WiFi y la IP estática. Este archivo **no se debe subir al repositorio**.

1.  Ve a la carpeta `firmware/remote-control/`.
2.  Busca el archivo `secrets_example.h`.
3.  Renómbralo a `secrets.h` (o crea una copia).
4.  Edita el contenido con tus datos:
    ```cpp
    #define WIFI_SSID "TU_WIFI"
    #define WIFI_PASS "TU_CONTRASEÑA"
    
    // IP del Robot (ESP32 Cam)
    #define STATIC_IP 192, 168, 1, 144 
    ```

## Estructura del Proyecto
- `JoystickManager.hpp`: Lee y filtra la entrada del joystick.
- `GiroscopeManager.hpp`: Procesa los datos del MPU6050 y calcula orientaciones.
- `CommunicationManager.hpp`: Gestiona el protocolo ESP-NOW con el robot.
- `WebSocketManager.hpp`: Servidor para telemetría directa hacia el Dashboard web.
- `remote-control.ino`: Bucle principal con gestión de estados y priorización de hardware.
