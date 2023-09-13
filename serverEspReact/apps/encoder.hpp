#include <BfButton.h>
#include <SPI.h>
#include <Wire.h>
#include <Adafruit_GFX.h>
#include <Adafruit_SSD1306.h>

int btnPin = 14;  // GPIO #3-Push button on encoder
int DT = 12;      // GPIO #4-DT on encoder (Output B)
int CLK = 13;     // GPIO #5-CLK on encoder (Output A)
BfButton btn(BfButton::STANDALONE_DIGITAL, btnPin, true, LOW);

int counter = 0;
int angle = 0;
int aState;
int aLastState;

bool insideMenuDrink = false;

String Screens[] = { ("Initial"), ("Aceptar?"), ("Sirviendo") };

int actualScreen = 0;

class ObjectData {
public:
  String nameLiquid;
  const char *waterpumpOutput;
  int gpio;
};

ObjectData MyDrinks[4] = {
  { "Cocacola", "waterPump1", 0 },
  { "Agua", "waterPump2", 2 },
  { "Vodka", "waterPump3", 16 },
  { "Naranja", "waterPump4", 15 },
};


int MAX_VALUE = sizeof(MyDrinks) / sizeof(MyDrinks[0]);

/// NEW FEATURE
class PropietyLiquid {
public:
  String nameLiquid;
  int quantity;
};

PropietyLiquid Liquid[4] = {
  { "Cocacola", 30 },
  { "Agua", 50 },
};

class Cocktails {
public:
  String nameCocktail;
  PropietyLiquid Liquid[2];
};


Cocktails MyCocktails[10] = {
  { "Sex on The Beach", { {"Cocacola", 30}, {"Agua", 50} } },
};


///


void OffAllwaterpumps() {
  pinMode(0, OUTPUT);
  pinMode(2, OUTPUT);
  pinMode(16, OUTPUT);
  pinMode(15, OUTPUT);
  digitalWrite(0, 0);
  digitalWrite(2, 0);
  digitalWrite(16, 0);
  digitalWrite(15, 0);
}

void ClickButton() {
  if (actualScreen == 1) {
    insideMenuDrink = true;
    actualScreen = 2;
  }
  if (actualScreen == 0 & counter != 0) {
    SetScreen("Aceptar?", MyDrinks[counter - 1].nameLiquid, 2);
    actualScreen = 1;
  }
}

// Button press hanlding function
void pressHandler(BfButton *btn, BfButton::press_pattern_t pattern) {
  switch (pattern) {
    case BfButton::SINGLE_PRESS:
      Serial.println("Click nornmal");
      ClickButton();
      break;

    case BfButton::DOUBLE_PRESS:
      Serial.println("Doble click");
      insideMenuDrink = false;
      counter = 0;
      actualScreen = 0;
      SetScreen("Elige", "bebida", 2);
      OffAllwaterpumps();
      break;

    case BfButton::LONG_PRESS:
      Serial.println("Click largo");
      insideMenuDrink = false;
      counter = 0;
      actualScreen = 0;
      SetScreen("Elige", "bebida", 2);
      OffAllwaterpumps();
      break;
  }
}

void setupEncoder() {
  pinMode(CLK, INPUT_PULLUP);
  pinMode(DT, INPUT_PULLUP);
  aLastState = digitalRead(CLK);
  // Button settings
  btn.onPress(pressHandler)
    .onDoublePress(pressHandler)      // default timeout
    .onPressFor(pressHandler, 1000);  // custom timeout for 1 second
}

void loopEncoder() {
  Serial.println(MyCocktails[0].Liquid[0].nameLiquid);
  // put your main code here, to run repeatedly:
  // Wait for button press to execute commands
  btn.read();
  const char *waterpumpOutput = MyDrinks[counter - 1].waterpumpOutput;
  String nameLiquid = MyDrinks[counter - 1].nameLiquid;
  int gpio = MyDrinks[counter - 1].gpio;
  if (digitalRead(btnPin) == HIGH) {  // Si el botón no está pulsado
    if (insideMenuDrink == true) {
      pinMode(gpio, OUTPUT);
      SetScreen("Sirvete", nameLiquid, 2);
      OffAllwaterpumps();
    }
  } else {
    // Si el botón está pulsado
    if (insideMenuDrink == true) {
      pinMode(gpio, OUTPUT);
      SetScreen("Sirviendo", nameLiquid, 2);
      digitalWrite(gpio, 1);
    }
  }
  //
  aState = digitalRead(CLK);

  // Encoder rotation tracking
  if (aState != aLastState) {
    if (insideMenuDrink == false) {
      actualScreen = 0;
      if (digitalRead(DT) != aState) {
        // derecha
        counter++;
      } else {
        if (counter > 0) {
          /// izquierda
          counter--;
        }
      }
      if (counter >= MAX_VALUE) {
        counter = MAX_VALUE;
      }
      if (counter <= -MAX_VALUE) {
        counter = -MAX_VALUE;
      }

      if (counter != 0) {
        SetScreen(MyDrinks[counter - 1].nameLiquid, "", 2);
      }
    }
  }

  aLastState = aState;
}