#include <WiFi.h>
#include <ESPAsyncWebServer.h>
#include <ESPmDNS.h>
#include "utils/config.h"
#include "utils/JoystickManager.hpp"
#include "utils/GiroscopeManager.hpp"
#include "utils/CommunicationManager.hpp"
#include "utils/WebSocketManager.hpp"

// State tracking to reduce traffic
String lastJoyDir = "";
String lastGyroDir = "";
String lastBtn = "";

AsyncWebServer server(80);

void setup() {
  Serial.begin(115200);
  Serial.println("REMOTE: Starting (Hardware Priority)...");
  Serial.print("REMOTE MAC: ");
  Serial.println(WiFi.macAddress());

  // 1. Init Hardware FIRST (Works without WiFi)
  JoystickManager::getInstance().begin();
  GiroscopeManager::getInstance().begin();
  
  // 2. Smart WiFi Connection (Prevents channel hopping if network is missing)
  WiFi.mode(WIFI_STA);
  Serial.println("REMOTE: Scanning for " + String(WIFI_SSID) + "...");
  
  int n = WiFi.scanNetworks();
  bool found = false;
  for (int i = 0; i < n; ++i) {
    if (WiFi.SSID(i) == WIFI_SSID) {
      found = true;
      break;
    }
  }

  if (found) {
      WiFi.begin(WIFI_SSID, WIFI_PASS);
      Serial.println("REMOTE: Connecting to WiFi...");
      while (WiFi.status() != WL_CONNECTED) {
        delay(500);
        Serial.print(".");
      }
      Serial.println();
      Serial.print("REMOTE: Connected! IP: ");
      Serial.println(WiFi.localIP());
      
      if (MDNS.begin("remote-control")) {
        Serial.println("REMOTE: MDNS Responder Started (remote-control.local)");
        MDNS.addService("http", "tcp", 80);
      }
  } else {
      Serial.println("REMOTE: Network not found. Enforcing Offline Mode (Channel 1).");
      WiFi.disconnect(); 
      esp_wifi_set_promiscuous(true);
      esp_wifi_set_channel(1, WIFI_SECOND_CHAN_NONE);
      esp_wifi_set_promiscuous(false);
  }

  // 3. Init ESP-NOW (Can work in both modes if channel is set)
  CommunicationManager::getInstance().begin(); 

  // Configuración de CORS y Redes Privadas para Chrome
  DefaultHeaders::Instance().addHeader("Access-Control-Allow-Origin", "*");
  DefaultHeaders::Instance().addHeader("Access-Control-Allow-Private-Network", "true");
  DefaultHeaders::Instance().addHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");

  // 4. Start WebSocket Server (Direct Telemetry to React)
  WebSocketManager::getInstance().begin(server);

  server.begin();
}

void loop() {
  static unsigned long lastWifiCheck = 0;
  if (millis() - lastWifiCheck > 5000) {
    lastWifiCheck = millis();
    if (WiFi.status() == WL_CONNECTED) {
      // Serial.printf("WiFi: Connected (RSSI: %d dBm) IP: %s\n", 
      //               WiFi.RSSI(), WiFi.localIP().toString().c_str());
    } else {
      Serial.println("WiFi: DISCONNECTED!");
    }
  }

  delay(50); // 20Hz cycle

  JoystickValues joy = JoystickManager::getInstance().getValues();
  String gyroDir = GiroscopeManager::getInstance().getDirection();

  // 1. Send to Robot via ESP-NOW (Hardware Control)
  if (joy.direction != lastJoyDir || joy.buttonState != lastBtn || gyroDir != lastGyroDir) {
    struct_message msg;
    msg.joystickValues.direction = joy.direction;
    msg.joystickValues.buttonState = joy.buttonState;
    msg.giroscopeValues.X = GiroscopeManager::getInstance().getX();
    msg.giroscopeValues.Y = GiroscopeManager::getInstance().getY();

    CommunicationManager::getInstance().send(msg);

    // Update state
    lastJoyDir = joy.direction;
    lastBtn = joy.buttonState;
    lastGyroDir = gyroDir;
    
    Serial.printf("REMOTE: Joy X:%d Y:%d Btn:%d -> %s (%s) | Gyro:%s\n", 
                  analogRead(PIN_JOY_X), analogRead(PIN_JOY_Y), analogRead(PIN_JOY_BTN), 
                  joy.direction.c_str(), joy.buttonState.c_str(), gyroDir.c_str());
  }

  // 2. Broadcast WebSockets directly to React (Every loop for smooth UI)
  WebSocketManager::getInstance().broadcastState(
      GiroscopeManager::getInstance().getX(),
      GiroscopeManager::getInstance().getY(),
      joy.direction,
      joy.buttonState == "on"
  );
}
