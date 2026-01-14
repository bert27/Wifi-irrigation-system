void ConnectWiFi_STA()
{
  Serial.println("");
  WiFi.mode(WIFI_STA);
  Serial.println("STA: Scanning for network...");
  int n = WiFi.scanNetworks();
  bool found = false;
  
  for (int i = 0; i < n; ++i) {
    if (WiFi.SSID(i) == String(ssid)) {
      found = true;
      break;
    }
  }

  if (found) {
    WiFi.begin(ssid, password);
    WiFi.config(ip, gateway, subnet);
    Serial.println("STA: Network found. Connecting in background...");
  } else {
    Serial.println("STA: Network NOT found. Running in Offline Mode (Channel 1).");
    WiFi.disconnect();
    wifi_set_channel(1); // Specific for ESP8266
  }
}

void ConnectWiFi_AP(bool useStaticIP = false)
{
  Serial.println("");
  WiFi.mode(WIFI_AP);
  while (!WiFi.softAP(ssid, password))
  {
    Serial.println(".");
    delay(100);
  }
  if (useStaticIP)
    WiFi.softAPConfig(ip, gateway, subnet);

  Serial.println("");
  Serial.print("Iniciado AP:\t");
  Serial.println(ssid);
  Serial.print("IP address:\t");
  Serial.println(WiFi.softAPIP());
}
