# RobotCore - Sistema de Riego Inteligente & Cocktelería Automática (ESP8266 + React)

## 🌟 Descripción del Proyecto

Este ecosistema de software y hardware permite el control avanzado del microcontrolador **ESP8266** (NodeMCU, Wemos D1 Mini, etc.) a través de una interfaz web moderna construida con **React**. 

Orientado originalmente al riego automatizado, el proyecto ha evolucionado hacia la creación de una **máquina de cocktelería ultra compacta**, aprovechando la conectividad Wi-Fi nativa del ESP8266 para gestionar múltiples bombas de agua con precisión PWM (Pulse Width Modulation).

> **🌐 [Visita RobotCore](https://wifi-irrigation-system.vercel.app/)**

---

## 🎨 Interfaz Cyberpunk Premium

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

## 🎮 Control Dual y Modo Offline (ESP-NOW)

Este sistema destaca por su versatilidad en la conectividad:

- **Modo Offline (Barrio)**: El mando y el robot se comunican mediante **ESP-NOW** (señal de radio directa). No requieren WiFi ni router para funcionar. Ideal para presentaciones en exteriores.
- **Modo Online (Dashboard)**: Conexión vía WiFi para telemetría avanzada. Cada módulo actúa como su propio servidor de **WebSockets**, enviando datos en tiempo real al dashboard de React.
- **Arquitectura Desacoplada**: El mando físico y el dashboard web pueden convivir; el robot procesa órdenes de ambas fuentes simultáneamente sin conflictos.

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

### Instalación Manual del Firmware
1. Abre el archivo en `/server/firmware` (Robot) o `/remote-control/firmware` (Mando) con Arduino IDE o VSCode.
2. Configura las credenciales en `secrets.h` (en la raíz o carpeta local configurada).
3. Carga el sketch a tus dispositivos. El robot y el mando se vincularán automáticamente por MAC address.

---

## 📋 Características Implementadas

### Dashboard & Mando Físico
- [x] Control inalámbrico de largo alcance (ESP-NOW)
- [x] Telemetría directa desde el mando a la Web (WebSocket `/ws/remote`)
- [x] Visualización 3D del giroscopio del mando en tiempo real
- [x] Control híbrido Web/Físico sin interrupciones

### Módulo Robot Car
- [x] Control de motores de alta frecuencia
- [x] Telemetría interna de inclinación (Pitch/Roll)
- [x] Efectos de iluminación RGB sincronizados

### Cocktail Mixer & Drinks
- [x] Interfaz física en pantalla OLED (Menú autónomo)
- [x] Selección de bebidas desde el mando (Joystick Up/Down/Accept)
- [x] API de control remoto y visualización en dashboard

---

## 🎯 Próximas Mejoras
- [ ] Gestión de recetas personalizadas persistentes
- [ ] Soporte para múltiples mandos simultáneos
- [ ] Integración de cámara ESP32-Cam para streaming en tiempo real
- [ ] Modo de aprendizaje de rutas (Gravedad asistida)

