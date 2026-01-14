#include <WiFi.h>
#include <ESPAsyncWebServer.h>
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

  // 1. Init Hardware FIRST (Works without WiFi)
  JoystickManager::getInstance().begin();
  GiroscopeManager::getInstance().begin();
  CommunicationManager::getInstance().begin(); // ESP-NOW setup

  // 2. Smart WiFi Connection (Prevents channel hopping if network is missing)
  WiFi.mode(WIFI_STA);
  Serial.println("REMOTE: Scanning for " + String(WIFI_SSID) + "...");
  
  int n = WiFi.scanNetworks();
  bool found = false;
  for (int i = 0; i < n; ++i) {
    if (WiFi.SSID(i) == WIFI_SSID) {
      found = true;
      Serial.println("REMOTE: Network found (Signal: " + String(WiFi.RSSI(i)) + " dBm)");
      break;
    }
  }

  if (found) {
      WiFi.begin(WIFI_SSID, WIFI_PASS);
      Serial.println("REMOTE: Connecting to WiFi...");
  } else {
      Serial.println("REMOTE: Network not found. Enforcing Offline Mode (Channel 1).");
      WiFi.disconnect(); 
      // Force Channel 1 for stable ESP-NOW in offline mode
      esp_wifi_set_promiscuous(true);
      esp_wifi_set_channel(1, WIFI_SECOND_CHAN_NONE);
      esp_wifi_set_promiscuous(false);
  }

  // 3. Start WebSocket Server (Direct Telemetry to React)
  WebSocketManager::getInstance().begin(server);
  server.begin();
}

void loop() {
  delay(50); // 20Hz cycle

  JoystickData joy = JoystickManager::getInstance().getValues();
  String gyroDir = GiroscopeManager::getInstance().getDirection();

  // 1. Send via ESP-NOW to Robot (Only on change)
  if (joy.direction != lastJoyDir || joy.buttonState != lastBtn || gyroDir != lastGyroDir) {
    struct_message msg;
    msg.id = 99;
    
    joy.direction.toCharArray(msg.choose, 85);
    gyroDir.toCharArray(msg.giroscope, 85);
    
    msg.joystickValues.direction = joy.direction;
    msg.joystickValues.buttonState = joy.buttonState;
    msg.giroscopeValues.X = GiroscopeManager::getInstance().getX();
    msg.giroscopeValues.Y = GiroscopeManager::getInstance().getY();

    CommunicationManager::getInstance().send(msg);

    // Update state
    lastJoyDir = joy.direction;
    lastBtn = joy.buttonState;
    lastGyroDir = gyroDir;
    
    Serial.printf("REMOTE: Sent Joy:%s Gyro:%s\n", joy.direction.c_str(), gyroDir.c_str());
  }

  // 2. Broadcast WebSockets directly to React (Every loop for smooth UI)
  WebSocketManager::getInstance().broadcastState(
      GiroscopeManager::getInstance().getX(),
      GiroscopeManager::getInstance().getY(),
      joy.direction,
      joy.buttonState == "on"
  );
}
