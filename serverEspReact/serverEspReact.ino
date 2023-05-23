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

#include <Wire.h>
#include <SPI.h>

void setup()
{
	Serial.begin(115200);
	ConnectWiFi_STA();
	InitServer();
}

void loop()
{
}
