#include <AsyncPrinter.h>
#include <async_config.h>
#include <DebugPrintMacros.h>
#include <ESPAsyncTCP.h>
#include <ESPAsyncTCPbuffer.h>
#include <SyncClient.h>
#include <tcp_axtls.h>

#include <ESP8266WiFi.h>
#include <ESPAsyncWebServer.h>
#include <FS.h>
#include <ArduinoJson.h>

#include "config.h"  // Sustituir con datos de vuestra red
#include "API.hpp"
#include "Server.hpp"
#include "ESP8266_Utils.hpp"


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
