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
void StartDisplay() {

  // SSD1306_SWITCHCAPVCC = generate display voltage from 3.3V internally
  if (!display.begin(SSD1306_SWITCHCAPVCC, SCREEN_ADDRESS)) {
    Serial.println(F("SSD1306 allocation failed"));
    for (;;)
      ;  // Don't proceed, loop forever
  }

  // Clear the buffer
  display.clearDisplay();
  display.setRotation(2);

  display.setTextSize(2);               // Normal 1:1 pixel scale
  display.setTextColor(SSD1306_WHITE);  // Draw white text
  display.setCursor(10, 0);             // Start at top-left corner
  display.println(F("Elije"));
  display.setCursor(10, 40);
  display.println(F("Cocktail"));
  display.display();
  delay(200);
}

void Control(String direction) {
  if (direction == "down") {
    Serial.println("Has apretado abajo");
    positionTmp = 1;
  } else if (direction == "up") {
    Serial.println("Has apretado arriba");
  } else if (direction == "next") {
    Serial.println("Has apretado siguiente");
  } else if (direction == "down") {
    Serial.println("Has apretado abajo");
  } else if (direction == "accept") {
    Serial.println("Has apretado aceptar");
  } else {
    // Invalid idValue
  }
}
void loop() {

  if (positionTmp == 1) {
    Serial.println("Hereee");
    display.clearDisplay();
    display.setRotation(2);

    display.setTextSize(2);               // Normal 1:1 pixel scale
    display.setTextColor(SSD1306_WHITE);  // Draw white text
    display.setCursor(10, 0);             // Start at top-left corner
    display.println(F("Elije"));
    display.setCursor(10, 40);
    display.println(F("hhhh"));
    display.display();
    delay(200);
    positionTmp = 0;
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
