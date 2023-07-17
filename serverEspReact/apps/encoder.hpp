#include <BfButton.h>
#include <SPI.h>
#include <Wire.h>
#include <Adafruit_GFX.h>
#include <Adafruit_SSD1306.h>

int btnPin = 14; // GPIO #3-Push button on encoder
int DT = 12;     // GPIO #4-DT on encoder (Output B)
int CLK = 13;    // GPIO #5-CLK on encoder (Output A)
BfButton btn(BfButton::STANDALONE_DIGITAL, btnPin, true, LOW);

String MyDrinks[] = {("Agua"), ("Cocacola")};

int counter = 0;
int angle = 0;
int aState;
int aLastState;
int MAX_VALUE = 2;
String chooseDrink = "";
void getDrinkName(int counter)
{
    chooseDrink = String(MyDrinks[counter - 1]);
}

// Button press hanlding function
void pressHandler(BfButton *btn, BfButton::press_pattern_t pattern)
{
    switch (pattern)
    {
    case BfButton::SINGLE_PRESS:
        Serial.println("Single push");
        getDrinkName(counter);
        SetScreen("Aceptar?", chooseDrink, 2);
        break;

    case BfButton::DOUBLE_PRESS:
        Serial.println("Double push");
        break;

    case BfButton::LONG_PRESS:
        Serial.println("Long push");
        break;
    }
}

void setupEncoder()
{
    pinMode(CLK, INPUT_PULLUP);
    pinMode(DT, INPUT_PULLUP);
    aLastState = digitalRead(CLK);
    // Button settings
    btn.onPress(pressHandler)
        .onDoublePress(pressHandler)     // default timeout
        .onPressFor(pressHandler, 1000); // custom timeout for 1 second
}

void loopEncoder()
{

    // put your main code here, to run repeatedly:

    // Wait for button press to execute commands
    btn.read();

    // Mientras se pulsa
    if (digitalRead(btnPin) == HIGH)
    { // Si el botón está pulsado
      // Serial.println("Saliendo Liquido");
    }
    else
    {   // Si el botón no está pulsado
        // Serial.println("Deteniendo Liquido");
    }
    //
    aState = digitalRead(CLK);

    // Encoder rotation tracking
    if (aState != aLastState)
    {

        if (digitalRead(DT) != aState)
        {
            counter++;

            // derecha
        }
        else
        {
            if (counter > 0)
            {
                counter--;
            }

            /// izquierda
        }
        if (counter >= MAX_VALUE)
        {
            counter = MAX_VALUE;
        }
        if (counter <= -MAX_VALUE)
        {
            counter = -MAX_VALUE;
        }
        //    SetScreen("counter", String(counter), 2);
        // Serial.println(counter);
        switch (counter)
        {
        case 0:
            Serial.println("Pantalla 0");
            SetScreen("Elije", "Cocktail", 2);
            break;

        case 1:
            Serial.println("Pantalla 1");
            SetScreen("Agua", "", 2);
            break;

        case 2:
            Serial.println("Pantalla 2");
            SetScreen("Cocacola", "", 2);
            break;
        }
    }

    aLastState = aState;
}