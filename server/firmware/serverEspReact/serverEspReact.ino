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

#include "apps/irrigation/services/API.hpp"
#include "apps/drinks machine/services/API.hpp"
#include "apps/robot car/services/API.hpp"

#include "apps/irrigation/controller.hpp"
#include "apps/drinks machine/utils/display.hpp"
#include "apps/drinks machine/controller.hpp"
#include "apps/robot car/utils/gyroscope.hpp"
#include "apps/robot car/controller.hpp"
#include "apps/robot car/services/websocket.hpp"
#include "apps/drinks machine/services/websocket.hpp"
#include "utils/RemoteControlHub.hpp"
#include <Wire.h>
#include <SPI.h>




void setup() {

  Serial.begin(115200);
  Serial.println("Arrancando");
  //

  ConnectWiFi_STA();
  setupPlantController();
  StartDisplay();
  // ListenDisplay(); // Removed, handled by setupDrinksAPI
  setupController();
  setupGyroscope();
  setupRemoteHub();
  setupCarWebSocket(irrigationSystem.server);
  setupDrinksWebSocket(irrigationSystem.server);
  
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
  CarController::getInstance().loop();
}