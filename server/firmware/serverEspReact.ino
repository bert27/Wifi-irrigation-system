#include <ESP8266WiFi.h>
#include <AsyncPrinter.h>
#include <async_config.h>
#include <DebugPrintMacros.h>
#include <ESPAsyncTCP.h>
#include <ESPAsyncTCPbuffer.h>
#include <SyncClient.h>
#include <tcp_axtls.h>

#include <ESPAsyncWebServer.h>
#include <FS.h>
#include <ArduinoJson.h>

#include "configNetwork.h"

#include "utils\wifi-start.hpp"

#include "apps\plant\services\API.hpp"
#include "apps\drinks\services\API.hpp"
#include "apps\car\services\API.hpp"

#include "apps\plant\controller.hpp"
#include "apps\drinks\display.hpp"
#include "apps\drinks\controller.hpp"
#include "apps\car\gyroscope.hpp"
#include "apps\car\controller.hpp"
#include <Wire.h>
#include <SPI.h>




void setup() {

  Serial.begin(9600);
  Serial.println("Arrancando");
  //

  ConnectWiFi_STA();
  setupPlantController();
  StartDisplay();
  // ListenDisplay(); // Removed, handled by setupDrinksAPI
  setupController();
  setupGyroscope();
  
  // Setup Car Controller
  CarController::getInstance().begin();

  // Setup App APIs

  // Setup App APIs
  extern AsyncWebServer server; // Ensure server is available (it's in irrigation_system_clock.hpp but we might need a getter if it's private... wait, we made it public)
  // Actually, irrigationSystem.server is public now.
  setupPlantAPI(irrigationSystem.server);
  setupDrinksAPI(irrigationSystem.server);
  setupCarAPI(irrigationSystem.server);
}


void loop() {
  loopDisplay();
  loopController();
}