#pragma once

#include <SPI.h>
#include <Adafruit_GFX.h>
#include <Adafruit_SSD1306.h>
#include "../../utils/RemoteControlHub.hpp"
#include "../../utils/remote_protocol.h"
#include "services/websocket.hpp"
#include "models.hpp"
#include "config.hpp"

// New Services
#include "services/MenuService.hpp"
#include "services/PumpsService.hpp"
#include "services/InputService.hpp"
#include "services/DisplayService.hpp"

class DrinksMachine {
public:
    static DrinksMachine& getInstance() {
        static DrinksMachine instance;
        return instance;
    }

    // Public state for telemetry
    int counter = 0;
    bool insideMenuDrink = false;
    int actualScreen = 0;

    void begin() {
        Serial.println("Welcome to Drink Machine");
        
        DisplayService::getInstance().begin();
        MenuService::getInstance().begin();
        PumpsService::getInstance().begin();
        InputService::getInstance().begin(pressHandlerStub);

        Serial.print("IP Address: ");
        Serial.println(WiFi.localIP());

        // Subscribe to Remote Control
        RemoteControlHub::getInstance().subscribe([this](const struct_message& msg) {
            this->handleRemoteCommand(msg);
        });

        // WebSocket Callback
        DrinksWebSocketHandler::getInstance().setOnConnectCallback([this](AsyncWebSocketClient* client) {
            auto& menu = MenuService::getInstance().menu;
            String currentDrinkName = "Seleccione";
            if (menu.size() > 0 && counter > 0 && counter <= (int)menu.size()) {
                currentDrinkName = menu[counter - 1].name;
            }
            
            DrinksWebSocketHandler::getInstance().sendStateToClient(
                client, 
                counter, 
                currentDrinkName, 
                actualScreen, 
                this->wasServing
            );
        });
    }

    // Command Queue
    String pendingCommand = "";
    unsigned long lastPollTime = 0;
    const unsigned long POLL_INTERVAL = 20;

    // Broadcast throttling
    bool needsBroadcast = false;
    unsigned long lastBroadcastTime = 0;
    const unsigned long BROADCAST_INTERVAL = 50;

    void loop() {
        loopRemoteHub();
   // Handle Serving Logic
        handleServingLogic();
        // Process external commands
        if (pendingCommand != "") {
            String cmd = pendingCommand;
            pendingCommand = ""; 
            
            if (cmd.startsWith("goto:")) {
                int index = cmd.substring(5).toInt();
                actionGoto(index);
            }
            else if (cmd.startsWith("pump:")) {
                int firstColon = cmd.indexOf(':');
                int secondColon = cmd.indexOf(':', firstColon + 1);
                int thirdColon = cmd.indexOf(':', secondColon + 1);
                
                int pumpId = cmd.substring(firstColon + 1, secondColon).toInt();
                int pwm = cmd.substring(secondColon + 1, thirdColon).toInt();
                float time = cmd.substring(thirdColon + 1).toFloat();
                
                actionUpdatePump(pumpId, pwm, time);
            }
            else if (cmd == "next" ) actionNext();
            else if (cmd == "prev") actionPrev();
            else if (cmd == "select") actionSelect();
            else if (cmd == "back") actionBack();
            else if (cmd == "cancel") actionCancel();
        }

        handleBroadcast();

        if (millis() - lastPollTime < POLL_INTERVAL) return;
        lastPollTime = millis();

        InputService::getInstance().loop(); // Poll button
        
        // Handle Inputs
        InputAction aAction = InputService::getInstance().checkAnalogInput();
        if (aAction != ACTION_NONE) executeAction(aAction);

        InputAction eAction = InputService::getInstance().checkEncoderRotation();
        if (eAction != ACTION_NONE) executeAction(eAction);

     
    }

    void handleBroadcast() {
        if (needsBroadcast && (millis() - lastBroadcastTime > BROADCAST_INTERVAL)) {
            needsBroadcast = false;
            lastBroadcastTime = millis();
            
            auto& menu = MenuService::getInstance().menu;
            String drinkName = (counter > 0 && counter <= (int)menu.size()) ? menu[counter-1].name : "Ninguna";
            DrinksWebSocketHandler::getInstance().broadcastState(counter, drinkName, actualScreen, insideMenuDrink);
        }
    }

    void enqueueCommand(String cmd) {
        pendingCommand = cmd;
    }

private:
    DrinksMachine() {}

    void executeAction(InputAction action) {
        switch(action) {
            case ACTION_NEXT: actionNext(); break;
            case ACTION_PREV: actionPrev(); break;
            case ACTION_SELECT: actionSelect(); break;
            case ACTION_BACK: actionBack(); break;
            case ACTION_CANCEL: actionCancel(); break;
            default: break;
        }
    }

    static void pressHandlerStub(BfButton *btn, BfButton::press_pattern_t pattern) {
        switch (pattern) {
            case BfButton::SINGLE_PRESS:
                DrinksMachine::getInstance().actionSelect();
                break;
            case BfButton::DOUBLE_PRESS:
            case BfButton::LONG_PRESS:
                DrinksMachine::getInstance().actionCancel(); 
                break;
        }
    }

    void clampCounter() {
        int maxVal = (int)MenuService::getInstance().menu.size();
        if (counter > maxVal) counter = maxVal;
        if (counter < 0) counter = 0;
    }

    void updateScreen() {
        auto& menu = MenuService::getInstance().menu;
        if (counter != 0 && counter <= (int)menu.size()) {
            DisplayService::getInstance().setScreen(menu[counter - 1].name, "", 2);
        } else {
             DisplayService::getInstance().setScreen("Elige", "bebida", 2);
        }
    }

    // --- Actions ---
    void actionNext() {
        if (insideMenuDrink) return; 
        counter++;
        clampCounter();
        updateScreen();
        broadcastState();
    }

    void actionPrev() {
        if (insideMenuDrink) return;
        if (counter > 0) counter--;
        clampCounter();
        updateScreen();
        broadcastState();
    }

    void actionSelect() {
        auto& menu = MenuService::getInstance().menu;
        if (actualScreen == 1) {
            insideMenuDrink = true;
            actualScreen = 2;
            currentServingDuration = PumpsService::getInstance().calculateServingDuration(menu[counter - 1]);
            servingStartTime = millis(); 
            DisplayService::getInstance().setScreen("Sirviendo...", menu[counter - 1].name, 2);
        } else if (actualScreen == 0) {
             if (counter > 0 && counter <= (int)menu.size()) {
                DisplayService::getInstance().setScreen("Aceptar?", menu[counter - 1].name, 2);
                actualScreen = 1;
             }
        }
        broadcastState();
    }

    // ... (Other actions like GOTO, BACK, CANCEL remain similar but use services) ...
    void actionGoto(int index) {
        auto& menu = MenuService::getInstance().menu;
        if (index > 0 && index <= (int)menu.size()) {
            counter = index;
            actualScreen = 1; 
            insideMenuDrink = false;
            DisplayService::getInstance().setScreen("Aceptar?", menu[counter - 1].name, 2);
            broadcastState();
        }
    }

    void actionBack() {
        if (actualScreen == 1) {
            actualScreen = 0;
            updateScreen();
            broadcastState();
        } else {
            actionPrev();
        }
    }

    void actionCancel() {
        insideMenuDrink = false;
        counter = 0;
        actualScreen = 0;
        updateScreen();
        PumpsService::getInstance().offAllPumps();
        broadcastState();
    }

    void actionUpdatePump(int pumpId, int pwm, float time) {
        auto& bottles = MenuService::getInstance().bottles;
        String liquidName = "Info";
        for (auto& b : bottles) {
            if (b.id == pumpId) {
                b.pwm = pwm;
                b.timeCalibration = time;
                liquidName = b.liquid;
                break;
            }
        }
        DisplayService::getInstance().setScreen("Bomba " + String(pumpId) + ": " + liquidName, "PWM:" + String(pwm) + " T:" + String(time) + "s", 1);
        MenuService::getInstance().saveBottles();
        broadcastState();
    }

    void handleRemoteCommand(const struct_message& msg) {
        if (msg.id == 99) {
            DisplayService::getInstance().setScreen("Sirviendo", msg.choose, 2);
            return;
        }
        String joyDir = String(msg.joystickValues.direction);
        if (joyDir == "Arriba") enqueueCommand("prev");
        else if (joyDir == "Abajo") enqueueCommand("next");
        else if (joyDir == "Izquierda") enqueueCommand("back");
        if (String(msg.joystickValues.buttonState) == "on") enqueueCommand("select");
    }

    void broadcastState() {
        needsBroadcast = true;
    }

    // Serving Logic
    bool wasServing = false; 
    unsigned long servingStartTime = 0;
    unsigned long currentServingDuration = 2000;
    int lastProgress = -1;

    void handleServingLogic() {
if (!insideMenuDrink) {
        lastProgress = -1; // Resetear para la próxima vez
        return;
    }

    auto& menu = MenuService::getInstance().menu;
    if (counter <= 0 || counter > (int)menu.size()) return;

    unsigned long elapsed = millis() - servingStartTime;
    
    // IMPORTANTE: Verifica que actualScreen sea 2
    bool isTimedServing = (actualScreen == 2 && elapsed < currentServingDuration);
    bool isManualServing = InputService::getInstance().isSelectPressed();
    bool isServing = isTimedServing || isManualServing;

    const auto& entry = menu[counter - 1];

    if (isServing) {
        wasServing = true;
        
        if (actualScreen == 2) {
            // Calculamos progreso de 0 a 100
            int progress = (int)((elapsed * 100) / currentServingDuration);
            if (progress > 100) progress = 100;

            // Solo actualizamos el OLED si el porcentaje cambió (ahorra tiempo de CPU)
            if (progress != lastProgress) {
                DisplayService::getInstance().drawProgress(entry.name, progress);
                lastProgress = progress;
            }
        }
        PumpsService::getInstance().processPumps(true, entry, elapsed);
        } else {
            if (wasServing) {
                DisplayService::getInstance().setScreen("Sirvete", entry.name, 2);
                wasServing = false;
                
                if (actualScreen == 2) {
                    actualScreen = 0;
                    insideMenuDrink = false;
                }
                
                PumpsService::getInstance().processPumps(false, entry, 0); 
                broadcastState();
            }
        }
    }
};

inline void setupController() {
    DrinksMachine::getInstance().begin();
}

inline void loopController() {
    DrinksMachine::getInstance().loop();
}