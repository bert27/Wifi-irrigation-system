#include <ArduinoJson.h> // Include FIRST to ensure correct version/flags if possible
#include <ESP8266WiFi.h>
#include <ESP8266mDNS.h>
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
#include "common/remote/RemoteControlHub.hpp"

// --- Modules ---

#ifdef ENABLE_IRRIGATION_SYSTEM
    #include "apps/irrigation/services/API.hpp"
    #include "apps/irrigation/controller.hpp"
    #include "apps/irrigation/config.hpp"
#endif

#ifdef ENABLE_DRINKS_MACHINE
    #include "apps/drinks machine/services/API.hpp"
    #include "apps/drinks machine/DrinksMachine.hpp"
    #include "apps/drinks machine/services/websocket.hpp"
    #include "apps/drinks machine/services/RemoteActions.hpp"
    #include "apps/drinks machine/config.hpp"
#endif

#ifdef ENABLE_ROBOT_CAR
    #include "apps/robot car/services/API.hpp"
    #include "apps/robot car/utils/gyroscope.hpp"
    #include "apps/robot car/controller.hpp"
    #include "apps/robot car/services/websocket.hpp"
    #include "apps/robot car/config.hpp"
#endif


// --- Server Instance Management ---
AsyncWebServer* globalServer = nullptr;
#ifndef ENABLE_IRRIGATION_SYSTEM
    AsyncWebServer standaloneServer(80);
#endif

void setup() {
  Serial.begin(115200);
  Serial.println("\n\n--- System Boot ---");

  // 1. Hardware & Outputs Initialization (PRIORITY: SAFE STATES)
  #ifdef ENABLE_DRINKS_MACHINE
      Serial.println("System: Drinks Machine Enabled");
      setupController(); // Drinks Controller (Inits pumps SAFE)
  #endif

  #ifdef ENABLE_IRRIGATION_SYSTEM
      Serial.println("System: Irrigation Enabled");
      setupPlantController();
  #endif

  #ifdef ENABLE_ROBOT_CAR
      Serial.println("System: Robot Car Enabled");
      setupGyroscope();
      CarController::getInstance().begin();
      // NO API/Socket init here yet
  #endif

  // 2. WiFi & Network (Takes time, but outputs are safe now)
  ConnectWiFi_STA();
  setupRemoteHub(); 

  // 3. Server Initialization (Initialize Pointer BEFORE using it)
  #ifdef ENABLE_IRRIGATION_SYSTEM
      // Irrigation initializes its own server controller, but we need the pointer valid
      // The controller was already inited in Step 1, so the server instance exists.
      globalServer = &IrrigationSystem::getInstance().server;
  #else
      Serial.println("System: Standalone Server Mode");
      globalServer = &standaloneServer;
      
      // CORS Config
      DefaultHeaders::Instance().addHeader("Access-Control-Allow-Origin", "*");
      DefaultHeaders::Instance().addHeader("Access-Control-Allow-Private-Network", "true");
      DefaultHeaders::Instance().addHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
      DefaultHeaders::Instance().addHeader("Access-Control-Allow-Headers", "*");
      
      // Verification Root
      standaloneServer.on("/", HTTP_GET, [](AsyncWebServerRequest *request){
        request->send(200, "text/plain", "OK - Server is LIVE");
      });
      
      // Handle Preflight OPTIONS requests for any route
      standaloneServer.onNotFound([](AsyncWebServerRequest *request) {
        Serial.print("HTTP: Request to: ");
        Serial.println(request->url());
        
        if (request->method() == HTTP_OPTIONS) {
          request->send(200);
        } else {
          request->send(404, "text/plain", "Not Found");
        }
      });
  #endif

  // 4. Networked Services (Now globalServer is VALID)
  #ifdef ENABLE_DRINKS_MACHINE
      if (globalServer) {
        setupDrinksAPI(*globalServer);
        setupDrinksWebSocket(*globalServer);
      }
      setupRemoteActions(); 
  #endif

  #ifdef ENABLE_IRRIGATION_SYSTEM
     // API already setup in step 1? No, wait.
     // Irrigation "setupPlantAPI" takes server reference.
     setupPlantAPI(*globalServer);
  #endif

  #ifdef ENABLE_ROBOT_CAR
      if (globalServer) {
        setupCarAPI(*globalServer);
        setupCarWebSocket(*globalServer);
      }
  #endif 
  
  // 5. Start Server
  #ifndef ENABLE_IRRIGATION_SYSTEM
      standaloneServer.begin();
  #endif

  // 6. mDNS Setup
  #ifdef ENABLE_IRRIGATION_SYSTEM
    if (MDNS.begin(MDNS_HOSTNAME)) {
      MDNS.addService("http", "tcp", 80);
    }
  #elif defined(ENABLE_DRINKS_MACHINE)
    if (MDNS.begin(MDNS_HOSTNAME)) {
      MDNS.addService("http", "tcp", 80);
    }
  #elif defined(ENABLE_ROBOT_CAR)
    if (MDNS.begin(MDNS_HOSTNAME)) {
      MDNS.addService("http", "tcp", 80);
    }
  #endif
  
  Serial.print("MDNS started: ");
  Serial.print(MDNS_HOSTNAME);
  Serial.println(".local");

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
  
  MDNS.update(); // Maintain mDNS response
  delay(1);      // CRITICAL: Yield to WiFi stack (prevents packet loss)
}