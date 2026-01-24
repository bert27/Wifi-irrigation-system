#pragma once
#include <Arduino.h>
#include <BfButton.h>
#include "../config.hpp"

// --- Helper Enums ---
enum KeypadButton {
    BTN_NONE = 0,
    BTN_RIGHT,
    BTN_LEFT,
    BTN_DOWN,
    BTN_UP,
    BTN_SELECT
};

enum InputAction {
    ACTION_NONE,
    ACTION_NEXT,
    ACTION_PREV,
    ACTION_SELECT,
    ACTION_BACK,
    ACTION_CANCEL
};

class InputService {
public:
    static InputService& getInstance() {
        static InputService instance;
        return instance;
    }

    void begin(void (*pressHandler)(BfButton *btn, BfButton::press_pattern_t pattern)) {
        pinMode(PIN_ENC_CLK, INPUT_PULLUP);
        pinMode(PIN_ENC_DT, INPUT_PULLUP);
        aLastState = digitalRead(PIN_ENC_CLK);

        btn.onPress(pressHandler)
           .onDoublePress(pressHandler)
           .onPressFor(pressHandler, 1000);
    }

    void loop() {
        btn.read();
    }

    InputAction checkAnalogInput() {
        if ((millis() - lastDebounceTime) < debounceDelay) return ACTION_NONE;

        int reading = analogRead(A0);
        KeypadButton currentBtn = getButtonFromAnalog(reading);

        if (currentBtn != BTN_NONE) {
            lastDebounceTime = millis();
            switch (currentBtn) {
                case BTN_UP:    return ACTION_PREV;
                case BTN_DOWN:  return ACTION_NEXT;
                case BTN_LEFT:  return ACTION_BACK; 
                case BTN_RIGHT: return ACTION_NEXT; 
                case BTN_SELECT: return ACTION_SELECT;
                default: return ACTION_NONE;
            }
        }
        return ACTION_NONE;
    }

    InputAction checkEncoderRotation() {
        InputAction action = ACTION_NONE;
        int aState = digitalRead(PIN_ENC_CLK);
        if (aState != aLastState) {
            bool forward = (digitalRead(PIN_ENC_DT) != aState);
            action = forward ? ACTION_NEXT : ACTION_PREV;
        }
        aLastState = aState;
        return action;
    }

    bool isSelectPressed() {
        int reading = analogRead(A0);
        KeypadButton aBtn = getButtonFromAnalog(reading);
        bool encoderPressed = (digitalRead(PIN_ENC_BTN) == LOW); 
        bool analogPressed = (aBtn == BTN_SELECT);
        return encoderPressed || analogPressed;
    }

private:
    BfButton btn;
    int aLastState;
    KeypadButton lastAnalogButton = BTN_NONE;
    unsigned long lastDebounceTime = 0;
    unsigned long debounceDelay = 200;

    InputService() : btn(BfButton::STANDALONE_DIGITAL, PIN_ENC_BTN, true, LOW) {}

    KeypadButton getButtonFromAnalog(int value) {
        if (value < 100) return BTN_NONE;
        if (value < 600) return BTN_RIGHT;
        if (value < 740) return BTN_LEFT;
        if (value < 830) return BTN_DOWN;
        if (value < 950) return BTN_UP;
        return BTN_SELECT;
    }
};
