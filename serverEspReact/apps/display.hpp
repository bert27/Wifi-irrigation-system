#include <SPI.h>
#include <Wire.h>
#include <Adafruit_GFX.h>
#include <Adafruit_SSD1306.h>

#define SCREEN_WIDTH 128  // OLED display width, in pixels
#define SCREEN_HEIGHT 64  // OLED display height, in pixels

#define OLED_RESET -1
#define SCREEN_ADDRESS 0x3C
Adafruit_SSD1306 display(SCREEN_WIDTH, SCREEN_HEIGHT, &Wire, OLED_RESET);
int positionTmp = 0;
int stop = 500;

void SetScreen(String first, String second, int size) {
  display.clearDisplay();
  display.setRotation(0);

  display.setTextSize(size);            // Normal 1:1 pixel scale
  display.setTextColor(SSD1306_WHITE);  // Draw white text
  display.setCursor(10, 10);            // Start at top-left corner
  display.println(first);
  display.setCursor(10, 40);
  display.println(second.c_str());
  display.display();
  delay(50);
}

void StartDisplay() {

  // SSD1306_SWITCHCAPVCC = generate display voltage from 3.3V internally
  if (!display.begin(SSD1306_SWITCHCAPVCC, SCREEN_ADDRESS)) {
    Serial.println(F("SSD1306 allocation failed"));
    for (;;)
      ;  // Don't proceed, loop forever
  }

  SetScreen("Elije", "Cocktail", 2);
}

void Control(String direction) {
  if (direction == "back") {
    Serial.println("Has apretado back");
 
  } else if (direction == "up") {
    Serial.println("Has apretado arriba");
  } else if (direction == "next") {
    Serial.println("Has apretado siguiente: " + String(positionTmp));
    if (positionTmp != 0) {
      positionTmp = positionTmp - stop;
    }
    positionTmp++;
  } else if (direction == "down") {
    Serial.println("Has apretado abajo");

    if (positionTmp != 0) {
      positionTmp = 500;
    }
  } else if (direction == "accept") {
    Serial.println("Has apretado aceptar");
  } else {
    // Invalid idValue
  }
}

void loopDisplay() {

  /*
  if (positionTmp == 0) {
    SetScreen("Elije", "Cocktail", 2);
  }*/
  if (positionTmp == 500) {
    SetScreen("Elije", "Cocktail", 2);
    positionTmp = 0;
  }
  if (positionTmp == 1) {

    SetScreen("Agua", "", 2);
    positionTmp = positionTmp + stop;
  } else if (positionTmp == 2) {

    SetScreen("Cocacola", "", 2);
    positionTmp = positionTmp + stop;
  } else if (positionTmp == 3) {

    positionTmp = 1;
  }
}
void ListenDisplay() {
  server.on(
    "/control", HTTP_GET, [](AsyncWebServerRequest *request) {
      String direction;
      if (request->hasParam("direction")) {
        direction = request->getParam("direction")->value();
        Control(direction);
      } else {
        direction = "No direction sent";
      }
      request->send(200, "text/plain", "the direction is: " + direction);
    });
}
