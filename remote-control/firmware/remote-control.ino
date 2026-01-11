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

  // 2. Start WiFi for Web/React in background (Non-blocking)
  WiFi.begin(WIFI_SSID, WIFI_PASS);
  Serial.println("REMOTE: WiFi Connection started in background...");

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
