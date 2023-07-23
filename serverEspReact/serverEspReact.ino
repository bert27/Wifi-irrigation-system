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
#include "utils\API.hpp"
#include "utils\wifi-start.hpp"

#include "apps\irrigation_system_clock.hpp"

#include "apps\display.hpp"
#include "apps\encoder.hpp"
#include <Wire.h>
#include <SPI.h>



#define pinClock1 1  // OPTIONAL CLOCK PIN 1 IN D7
#define pinClock2 3  // OPTIONAL CLOCK PIN 2 IN D8

void setup() {

  Serial.begin(9600);
  Serial.println("Arrancando");
  pinMode(waterPump1, OUTPUT);
  pinMode(waterPump2, OUTPUT);
  pinMode(waterPump3, OUTPUT);
  pinMode(waterPump4, OUTPUT);

  digitalWrite(waterPump1, 0);
  digitalWrite(waterPump2, 0);
  digitalWrite(waterPump3, 0);
  digitalWrite(waterPump4, 0);
  //

  ConnectWiFi_STA();
  InitServer();
  StartDisplay();
  ListenDisplay();
  setupEncoder();
}


void loop() {
  loopDisplay();
  loopEncoder();
}