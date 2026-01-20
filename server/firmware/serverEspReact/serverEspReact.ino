#include <ArduinoJson.h> // Include FIRST to ensure correct version/flags if possible
#include <ESP8266WiFi.h>
#include <AsyncPrinter.h>
#include <async_config.h>
#include <ESPAsyncTCP.h>
#include <ESPAsyncTCPbuffer.h>
#include <SyncClient.h>
#include <tcp_axtls.h>
#include <ESPAsyncWebServer.h>
#include <FS.h>
#include <Wire.h>
#include <SPI.h>

#include "configNetwork.h"
#include "AppConfig.h" // Modular Configuration
#include "utils/wifi-start.hpp"
#include "utils/RemoteControlHub.hpp"

// --- Modules ---

#ifdef ENABLE_IRRIGATION_SYSTEM
    #include "apps/irrigation/services/API.hpp"
    #include "apps/irrigation/controller.hpp"
#endif

#ifdef ENABLE_DRINKS_MACHINE
    #include "apps/drinks machine/services/API.hpp"
    #include "apps/drinks machine/utils/display.hpp"
    #include "apps/drinks machine/controller.hpp"
    #include "apps/drinks machine/services/websocket.hpp"
#endif

#ifdef ENABLE_ROBOT_CAR
    #include "apps/robot car/services/API.hpp"
    #include "apps/robot car/utils/gyroscope.hpp"
    #include "apps/robot car/controller.hpp"
    #include "apps/robot car/services/websocket.hpp"
#endif


// --- Server Instance Management ---
AsyncWebServer* globalServer = nullptr;
#ifndef ENABLE_IRRIGATION_SYSTEM
    AsyncWebServer standaloneServer(80);
#endif

void setup() {
  Serial.begin(115200);
  Serial.println("\n\n--- System Boot ---");

  // 1. WiFi & Network
  ConnectWiFi_STA();
  setupRemoteHub();

  // 2. Server Initialization
  #ifdef ENABLE_IRRIGATION_SYSTEM
      Serial.println("System: Irrigation Enabled");
      setupPlantController();
      globalServer = &IrrigationSystem::getInstance().server;
      setupPlantAPI(*globalServer);
  #else
      Serial.println("System: Standalone Server Mode");
      globalServer = &standaloneServer;
      standaloneServer.begin();
  #endif

  // 3. Module Initialization
  
  #ifdef ENABLE_DRINKS_MACHINE
      Serial.println("System: Drinks Machine Enabled");
      StartDisplay();
      setupController(); // Drinks Controller
      setupDrinksAPI(*globalServer);
      setupDrinksWebSocket(*globalServer);
  #endif

  #ifdef ENABLE_ROBOT_CAR
      Serial.println("System: Robot Car Enabled");
      setupGyroscope();
      CarController::getInstance().begin();
      setupCarAPI(*globalServer);
      setupCarWebSocket(*globalServer);
  #endif

  Serial.println("--- Boot Complete ---\n");
}

void loop() {
  // RemoteControlHub::getInstance().loop(); // Removed: Class does not have loop()

  #ifdef ENABLE_DRINKS_MACHINE
      loopController(); // Drinks Loop
  #endif

  #ifdef ENABLE_ROBOT_CAR
      CarController::getInstance().loop();
  #endif
}