#include "../../secrets.h"

const char* ssid     = WIFI_SSID;
const char* password = WIFI_PASS;
const char* hostname = "ServerRobot";

IPAddress ip(STATIC_IP);
IPAddress gateway(STATIC_GATEWAY);
IPAddress subnet(STATIC_SUBNET);
