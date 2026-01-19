# 🛠 Guía de Soldadura: Adaptador Teclado de Membrana a ESP8266

Dado que el ESP8266 tiene pocos pines digitales libres, convertiremos el teclado de 5 botones en una entrada **ANALÓGICA** usando resistencias. Esto nos permite leer los 5 botones usando **un solo cable (A0)**.

## Materiales Necesarios (Adaptado a lo que tienes)
- **Resistencias:**
    - 2x **1kΩ**
    - 2x **2.2kΩ**
    - 2x **6.8kΩ**
- **Configuración:**
    - **R_PullDown:** Usaremos una de **6.8kΩ** entre A0 y GND.

## 1. Identificar Pines (CRÍTICO)
No hay un estándar único, así que **debes identificar qué pin es cuál antes de soldar**.

1.  Pon tu multímetro en modo **Continuidad** (pitido).
2.  Coloca una punta en el **Pin 1** (extremo) y déjala ahí.
3.  Con la otra punta, toca los otros pines mientras pulsas botones.
    *   Si al pulsar un botón pita -> El Pin 1 es COMÚN (o ese botón).
    *   Si no pita con nada -> El Pin 1 es un botón. Prueba dejando fija la punta en el Pin 2.
4.  **Objetivo**: Encontrar el **PIN COMÚN** (el único pin que tiene continuidad con todos los demás al pulsar sus respectivos botones).
5.  Una vez tengas el COMÚN, anota qué botón corresponde a cada uno de los otros pines.

> **Ejemplo Típico (¡Verificar!)**:
> - Pin 1: Izquierda
> - Pin 2: Arriba
> - Pin 3: Común (VCC)
> - Pin 4: Abajo
> - Pin 5: Derecha
> - Pin 6: Select / Centro

## Esquema de Conexiones

### Circuito "Escalera" Adaptado
Calculado para R_PullDown = 6.8kΩ.

```text
                  PIN COMÚN del Teclado  ---->  3.3V (VCC)

Botón 1 (Centro/Select) ----[ Directo ]--+
                                         |
Botón 2 (Arriba)        ----[ 1kΩ ]------+
                                         |
Botón 3 (Abajo)         ----[ 2.2kΩ ]----+----->  Cable hacia PIN A0
                                         |
Botón 4 (Izq)           ----[ 1k + 2.2k ]+  <-- (Ponlas en serie = 3.2kΩ)
                                         |
Botón 5 (Der)           ----[ 6.8kΩ ]----+
                                         |
                                         |
                                      [ 6.8kΩ ]  (R_PullDown)
                                         |
                                        GND
```

### Valores Esperados (ADC)
- **Select (Directo):** ~1024 (3.3V)
- **Arriba (1k):**      ~892  (2.87V)
- **Abajo (2.2k):**     ~773  (2.5V)
- **Izq (3.2k):**       ~696  (2.2V)
- **Der (6.8k):**       ~512  (1.65V)


Así distinguimos qué botón se ha pulsado con un solo pin.
