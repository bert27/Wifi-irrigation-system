# Arquitectura de Control del Robot y Mando

Define el modelo de interacción entre el Panel Web (React), el Mando Físico (ESP32) y el Robot (ESP32).

## Visión General del Sistema

El sistema consta de tres nodos principales conectados vía Wi-Fi:

1.  **Robot (ESP32)**: El dispositivo objetivo a controlar.
    *   **IP**: `REACT_APP_ROBOT_IP` (ej. `192.168.1.97`)
    *   **Rol**: Recibe comandos de motor, envía telemetría (giroscopio, batería, etc.).
2.  **Mando Físico (ESP32)**: Un controlador manual.
    *   **IP**: `REACT_APP_REMOTE_IP` (ej. `192.168.1.96`)
    *   **Rol**: Lee datos del Joystick/IMU y los transmite vía WebSocket.
3.  **Panel Web (Cliente)**: La aplicación React.
    *   **Rol**: Visualiza el estado del Mando y envía comandos al Robot.

## Flujo de Conexión

El **Panel Web** (hook `useRobotControl`) mantiene **dos conexiones WebSocket independientes**:

### 1. Bucle de Control Remoto (Visualización)
*   **Fuente**: Mando Físico (ESP32)
*   **Protocolo**: WebSocket (`/ws`)
*   **Datos**: `IRemoteControlReceiveStatus` (Dirección del Joystick, Estado de botones, Giroscopio).
*   **Acción**: El Panel *escucha* este socket para visualizar lo que el usuario está haciendo con el mando físico (ej. moviendo el joystick virtual en pantalla).

### 2. Bucle de Control del Robot (Comando y Telemetría)
*   **Objetivo**: Robot (ESP32)
*   **Protocolo**: WebSocket (`/ws`) y HTTP (para algunos comandos).
*   **Datos (Rx)**: `IRobotSendStatus` (Estado del motor, LED, Giroscopio del Robot).
*   **Datos (Tx)**: Comandos enviados desde la interfaz del Panel (ej. al hacer clic en el joystick virtual).

## Lógica del Controlador Joystick

El componente `JostickController` tiene un doble propósito:

1.  **Visualización Pasiva**: Recibe `recibedMessage` del socket del **Mando Remoto** para mostrar la posición del joystick físico.
2.  **Control Activo**: Maneja las interacciones del usuario (clics) que activan `onDirection` -> `handleDirection`. Esto envía un comando directamente al socket/API del **Robot**.

```mermaid
graph TD
    Remote[Mando Físico ESP32] -->|WS: Estado (Joy/Gyro)| Dashboard[Panel Web]
    Dashboard -->|WS/HTTP: Comandos (Mover/LED)| Robot[Robot ESP32]
    Robot -->|WS: Telemetría (Gyro/Motores)| Dashboard
```

## Configuración

Asegúrate de que el archivo `.env` coincida con tu configuración de red:

```properties
REACT_APP_REMOTE_IP=http://192.168.1.96
REACT_APP_ROBOT_IP=http://192.168.1.97
```
