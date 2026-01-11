#pragma once

#include <BfButton.h>
#include <SPI.h>
#include <Wire.h>
#include <Adafruit_GFX.h>
#include <Adafruit_SSD1306.h>
#include <vector>
#include <string>

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

class EncoderManager {
public:
    static EncoderManager& getInstance() {
        static EncoderManager instance;
        return instance;
    }

    void begin() {
        setupPins();
        setupButton();
        offAllPumps();
    }

    void loop() {
        btn.read();
        handleButtonState();
        handleEncoderRotation();
    }

private:
    const int PIN_BTN = 14;
    const int PIN_DT = 12;
    const int PIN_CLK = 13;
    
    // Pump Pins (Drinks App manages all 4)
    static constexpr uint8_t PIN_PUMP_1 = 0;
    static constexpr uint8_t PIN_PUMP_2 = 2;
    static constexpr uint8_t PIN_PUMP_3 = 16;
    static constexpr uint8_t PIN_PUMP_4 = 15;

    BfButton btn;
    int aLastState;
    int aState;
    
    int counter = 0;
    bool insideMenuDrink = false;
    int actualScreen = 0;

    std::vector<Drink> drinks;
    std::vector<Cocktail> cocktails;

    EncoderManager() : btn(BfButton::STANDALONE_DIGITAL, 14, true, LOW) {
        drinks = {
            { "Cocacola", "waterPump1", PIN_PUMP_1 },
            { "Agua", "waterPump2", PIN_PUMP_2 },
            { "Vodka", "waterPump3", PIN_PUMP_3 },
            { "Naranja", "waterPump4", PIN_PUMP_4 }
        };

        cocktails.push_back({ "Sex on The Beach", { {"Cocacola", 30}, {"Agua", 50} } });
    }

    void setupPins() {
        pinMode(PIN_CLK, INPUT_PULLUP);
        pinMode(PIN_DT, INPUT_PULLUP);
        aLastState = digitalRead(PIN_CLK);
    }

    void setupButton() {
        btn.onPress(pressHandlerStub)
           .onDoublePress(pressHandlerStub)
           .onPressFor(pressHandlerStub, 1000);
    }
    
    static void pressHandlerStub(BfButton *btn, BfButton::press_pattern_t pattern);

    void handlePress(BfButton::press_pattern_t pattern);

    void clickButton() {
        if (actualScreen == 1) {
            insideMenuDrink = true;
            actualScreen = 2;
        }
        if (actualScreen == 0 && counter != 0) {
           extern void SetScreen(String, String, int); 
           if(counter > 0 && counter <= (int)drinks.size())
               SetScreen("Aceptar?", drinks[counter - 1].nameLiquid, 2);
            actualScreen = 1;
        }
    }

    void resetMenu() {
        insideMenuDrink = false;
        counter = 0;
        actualScreen = 0;
        extern void SetScreen(String, String, int);
        SetScreen("Elige", "bebida", 2);
        offAllPumps();
    }

    void offAllPumps() {
        int pins[] = {0, 2, 16, 15};
        for(int p : pins) {
            pinMode(p, OUTPUT);
            digitalWrite(p, 0);
        }
    }

    void handleButtonState() {
        if (counter <= 0 || counter > (int)drinks.size()) return;
        
        const auto& currentDrink = drinks[counter - 1];
        extern void SetScreen(String, String, int);

        if (digitalRead(PIN_BTN) == HIGH) {
            if (insideMenuDrink) {
                pinMode(currentDrink.gpio, OUTPUT);
                SetScreen("Sirvete", currentDrink.nameLiquid, 2);
                offAllPumps();
            }
        } else {
            if (insideMenuDrink) {
                pinMode(currentDrink.gpio, OUTPUT);
                SetScreen("Sirviendo", currentDrink.nameLiquid, 2);
                digitalWrite(currentDrink.gpio, 1);
            }
        }
    }

    void handleEncoderRotation() {
        aState = digitalRead(PIN_CLK);
        if (aState != aLastState) {
            if (!insideMenuDrink) {
                actualScreen = 0;
                if (digitalRead(PIN_DT) != aState) {
                    counter++;
                } else {
                    if (counter > 0) counter--;
                }
                
                int maxVal = (int)drinks.size();
                if (counter > maxVal) counter = maxVal;
                if (counter < -maxVal) counter = -maxVal;
                if (counter < 0) counter = 0;

                if (counter != 0) {
                     extern void SetScreen(String, String, int);
                     SetScreen(drinks[counter - 1].nameLiquid, "", 2);
                }
            }
        }
        aLastState = aState;
    }
};

inline void EncoderManager::pressHandlerStub(BfButton *btn, BfButton::press_pattern_t pattern) {
    EncoderManager::getInstance().handlePress(pattern);
}

inline void EncoderManager::handlePress(BfButton::press_pattern_t pattern) {
    switch (pattern) {
        case BfButton::SINGLE_PRESS:
            Serial.println("Click normal");
            clickButton();
            break;
        case BfButton::DOUBLE_PRESS:
            Serial.println("Doble click");
            resetMenu();
            break;
        case BfButton::LONG_PRESS:
            Serial.println("Click largo");
            resetMenu();
            break;
    }
}

inline void setupController() {
    EncoderManager::getInstance().begin();
}

inline void loopController() {
    EncoderManager::getInstance().loop();
}