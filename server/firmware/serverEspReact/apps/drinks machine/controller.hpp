#pragma once

#include <BfButton.h>
#include <SPI.h>
#include "utils/display.hpp"
#include <Adafruit_GFX.h>
#include <Adafruit_SSD1306.h>
#include "../../utils/RemoteControlHub.hpp"
#include "../../utils/remote_protocol.h"
#include "services/websocket.hpp"

struct Drink {
    String nameLiquid;
    String pumpId; 
    int gpio;
};

struct LiquidProp {
    String name;
    int quantity;
};

struct Cocktail {
    String name;
    std::vector<LiquidProp> ingredients;
};


// --- Helper Enums & Structs ---

// --- Helper Enums & Structs ---
enum KeypadButton {
    BTN_NONE = 0,
    BTN_RIGHT,
    BTN_LEFT,
    BTN_DOWN,
    BTN_UP,
    BTN_SELECT
};

// Unified Manager for both Analog Keypad (A0) and Rotary Encoder (D5,D6,D7)
class DrinksInputManager {
public:
    static DrinksInputManager& getInstance() {
        static DrinksInputManager instance;
        return instance;
    }

    // Public state for telemetry
    int counter = 0;
    bool insideMenuDrink = false;
    int actualScreen = 0;
    std::vector<Drink> drinks;

    void begin() {
        Serial.println("Welcome to Drink Machine");
        Serial.print("IP Address: ");
        Serial.println(WiFi.localIP());
        Serial.print("MAC Address: ");
        Serial.println(WiFi.macAddress());

        // Setup Encoder Pins
        setupEncoderPins();
        setupEncoderButton();

        // Setup Pumps
        offAllPumps();

        // Subscribe to Remote Control
        RemoteControlHub::getInstance().subscribe([this](const struct_message& msg) {
            this->handleRemoteCommand(msg);
        });
    }

    // Command Queue to avoid crashes in Async context
    String pendingCommand = "";

    void loop() {
        // Process external commands (Actions from Web/API)
        if (pendingCommand != "") {
            String cmd = pendingCommand;
            pendingCommand = ""; // Clear first
            if (cmd == "next" ) actionNext();
            else if (cmd == "prev") actionPrev();
            else if (cmd == "select") actionSelect();
            else if (cmd == "cancel") actionCancel();
        }

        if (millis() - lastPollTime < POLL_INTERVAL) return;
        lastPollTime = millis();

        // Poll Encoder Button
        btn.read();
        
        // Poll Analog Keypad
        handleAnalogInput();
        
        // Handle Rotation
        handleEncoderRotation();

        // Handle Servicing Logic
        handlePumpLogic();
    }

    // --- Actions ---

    void enqueueCommand(String cmd) {
        pendingCommand = cmd;
    }

    void actionNext() {
        if (insideMenuDrink) return; 
        Serial.println("Action: Next");
        counter++;
        clampCounter();
        updateScreen();
        broadcastState();
    }

    void actionPrev() {
        if (insideMenuDrink) return;
        Serial.println("Action: Prev");
        if (counter > 0) counter--;
        clampCounter();
        updateScreen();
        broadcastState();
    }

    void actionSelect() {
        Serial.println("Action: Select");
        if (actualScreen == 1) {
            insideMenuDrink = true;
            actualScreen = 2;
        } else if (actualScreen == 0) {
             if (counter > 0 && counter <= (int)drinks.size()) {
                extern void SetScreen(String, String, int); 
                SetScreen("Aceptar?", drinks[counter - 1].nameLiquid, 2);
                actualScreen = 1;
             }
        }
        broadcastState();
    }

    void actionCancel() {
        Serial.println("Action: Cancel");
        resetMenu();
    }

    // --- Remote Control ---
    void handleRemoteCommand(const struct_message& msg) {
        String joyDir = String(msg.choose);
        if (joyDir == "Arriba") actionPrev();
        else if (joyDir == "Abajo") actionNext();

        if (String(msg.joystickValues.buttonState) == "on") actionSelect();
    }

    void broadcastState() {
        String drinkName = (counter > 0 && counter <= (int)drinks.size()) ? drinks[counter-1].nameLiquid : "Ninguna";
        DrinksWebSocketHandler::getInstance().broadcastState(counter, drinkName, actualScreen, insideMenuDrink);
    }

    // --- Encoder Interrupt Handler ---
    void handlePress(BfButton::press_pattern_t pattern) {
        switch (pattern) {
            case BfButton::SINGLE_PRESS:
                actionSelect();
                break;
            case BfButton::DOUBLE_PRESS:
            case BfButton::LONG_PRESS:
                actionCancel(); // Long press resets menu
                break;
        }
    }

    static void pressHandlerStub(BfButton *btn, BfButton::press_pattern_t pattern) {
        DrinksInputManager::getInstance().handlePress(pattern);
    }

private:
    // Encoder Pins
    const int PIN_ENC_BTN = 14; // D5
    const int PIN_ENC_DT = 12;  // D6
    const int PIN_ENC_CLK = 13; // D7
    
    // Pump Pins
    static constexpr uint8_t PIN_PUMP_1 = 0;
    static constexpr uint8_t PIN_PUMP_2 = 2;
    static constexpr uint8_t PIN_PUMP_3 = 16;
    static constexpr uint8_t PIN_PUMP_4 = 15;
    
    // Encoder Vars
    BfButton btn;
    int aLastState;
    int aState;

    // Analog Vars
    KeypadButton lastAnalogButton = BTN_NONE;
    unsigned long lastDebounceTime = 0;
    unsigned long debounceDelay = 200; 

    std::vector<Cocktail> cocktails;

    DrinksInputManager() : btn(BfButton::STANDALONE_DIGITAL, 14, true, LOW) {
        drinks = {
            { "Cocacola", "waterPump1", PIN_PUMP_1 },
            { "Agua", "waterPump2", PIN_PUMP_2 },
            { "Vodka", "waterPump3", PIN_PUMP_3 },
            { "Naranja", "waterPump4", PIN_PUMP_4 }
        };
        cocktails.push_back({ "Sex on The Beach", { {"Cocacola", 30}, {"Agua", 50} } });
    }

    // --- Setup ---
    void setupEncoderPins() {
        pinMode(PIN_ENC_CLK, INPUT_PULLUP);
        pinMode(PIN_ENC_DT, INPUT_PULLUP);
        aLastState = digitalRead(PIN_ENC_CLK);
    }

    void setupEncoderButton() {
        btn.onPress(pressHandlerStub)
           .onDoublePress(pressHandlerStub)
           .onPressFor(pressHandlerStub, 1000);
    }

    void offAllPumps() {
        int pins[] = {PIN_PUMP_1, PIN_PUMP_2, PIN_PUMP_3, PIN_PUMP_4};
        for(int p : pins) {
            pinMode(p, OUTPUT);
            digitalWrite(p, 0); 
        }
    }

    // --- Analog Logic ---
    // #define DEBUG_ANALOG // Uncomment to debug analog values

    void handleAnalogInput() {
        if ((millis() - lastDebounceTime) < debounceDelay) return;

        int reading = analogRead(A0);
        
        #ifdef DEBUG_ANALOG
        static unsigned long lastPrint = 0;
        if (millis() - lastPrint > 500) {
            Serial.print("Analog Keypad Value: ");
            Serial.println(reading);
            lastPrint = millis();
        }
        #endif

        KeypadButton currentBtn = getButtonFromAnalog(reading);

        if (currentBtn != BTN_NONE) {
            lastDebounceTime = millis();
            
            #ifdef DEBUG_ANALOG
            Serial.print("Button Detected: ");
            Serial.println(reading);
            #endif

            switch (currentBtn) {
                case BTN_UP:    actionPrev(); break;
                case BTN_DOWN:  actionNext(); break;
                case BTN_LEFT:  actionPrev(); break; 
                case BTN_RIGHT: actionNext(); break; 
                case BTN_SELECT: actionSelect(); break;
                default: break;
            }
        }
    }

    KeypadButton getButtonFromAnalog(int value) {
        // Values based on 6.8k PullDown and Available Resistors:
        // RIGHT  (6.8k)       -> ~512  (Target Range: 400 - 600)
        // LEFT   (1k+2.2k)    -> ~696  (Target Range: 600 - 740)
        // DOWN   (2.2k)       -> ~773  (Target Range: 740 - 830)
        // UP     (1k)         -> ~892  (Target Range: 830 - 950)
        // SELECT (0)          -> ~1024 (Target Range: > 950)
        
        if (value < 100) return BTN_NONE;
        if (value < 600) return BTN_RIGHT;
        if (value < 740) return BTN_LEFT;
        if (value < 830) return BTN_DOWN;
        if (value < 950) return BTN_UP;
        return BTN_SELECT;
    }

    // --- Encoder Logic ---
    void handleEncoderRotation() {
        aState = digitalRead(PIN_ENC_CLK);
        if (aState != aLastState) {
            bool forward = (digitalRead(PIN_ENC_DT) != aState);
            if (forward) actionNext();
            else actionPrev();
        }
        aLastState = aState;
    }

    // --- Common ---
    void clampCounter() {
        int maxVal = (int)drinks.size();
        if (counter > maxVal) counter = maxVal;
        if (counter < 0) counter = 0;
    }

    void updateScreen() {
        if (counter != 0) {
            extern void SetScreen(String, String, int);
            SetScreen(drinks[counter - 1].nameLiquid, "", 2);
        } else {
             extern void SetScreen(String, String, int);
             SetScreen("Elige", "bebida", 2);
        }
    }

    void resetMenu() {
        insideMenuDrink = false;
        counter = 0;
        actualScreen = 0;
        updateScreen();
        offAllPumps();
        broadcastState();
    }

    bool wasServing = false; // State tracking to avoid I2C flooding

    void handlePumpLogic() {
        if (!insideMenuDrink) return;
        if (counter <= 0 || counter > (int)drinks.size()) return;

        const auto& currentDrink = drinks[counter - 1];
        
        // Check inputs
        int reading = analogRead(A0);
        KeypadButton aBtn = getButtonFromAnalog(reading);
        bool encoderPressed = (digitalRead(PIN_ENC_BTN) == LOW); 
        bool analogPressed = (aBtn == BTN_SELECT);
        bool isServing = (encoderPressed || analogPressed);

        if (isServing) {
            if (!wasServing) { // Only update screen ONCE when starting to serve
                extern void SetScreen(String, String, int);
                SetScreen("Sirviendo", currentDrink.nameLiquid, 2);
                wasServing = true;
            }
            pinMode(currentDrink.gpio, OUTPUT);
            digitalWrite(currentDrink.gpio, 1);
        } else {
            if (wasServing) { // Only update screen ONCE when stopping
                extern void SetScreen(String, String, int);
                SetScreen("Sirvete", currentDrink.nameLiquid, 2);
                wasServing = false;
                offAllPumps(); 
            }
            // Ensure pumps stay off (optional redundant safety, but cheap)
            // offAllPumps(); 
        }
    }
};

inline void setupController() {
    DrinksInputManager::getInstance().begin();
}

inline void loopController() {
    DrinksInputManager::getInstance().loop();
}