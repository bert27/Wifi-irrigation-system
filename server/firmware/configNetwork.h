#include "secrets.h"

const char* ssid     = WIFI_SSID;
const char* password = WIFI_PASS;
const char* hostname = "ServerRobot";

IPAddress ip(192, 168, 1, 200);
IPAddress gateway(192, 168, 1, 1);
IPAddress subnet(255, 255, 255, 0);
