void ConnectWiFi_STA()
{
  Serial.println("");
  WiFi.mode(WIFI_STA);
  WiFi.hostname("DrinksMachine"); // Help Router identify us
  WiFi.setSleepMode(WIFI_NONE_SLEEP); // Disable power saving to ensure Ping/HTTP always works
  Serial.print("STA: Scanning for network (Sleep Mode Disabled)...");
  int n = WiFi.scanNetworks();
  bool found = false;
  
  Serial.print("Found ");
  Serial.print(n);
  Serial.println(" networks.");
  
  for (int i = 0; i < n; ++i) {
    Serial.print(i + 1);
    Serial.print(": ");
    Serial.print(WiFi.SSID(i));
    Serial.print(" (");
    Serial.print(WiFi.RSSI(i));
    Serial.println(")");
    
    if (WiFi.SSID(i) == String(ssid)) {
      found = true;
      break;
    }
  }

  if (found) {
    WiFi.begin(ssid, password);
    // WiFi.config(ip, gateway, subnet); // Disabled: Using DHCP
    Serial.print("STA: Connecting to WiFi (" + String(ssid) + ")...");
    
    // Force wait for connection
    while (WiFi.status() != WL_CONNECTED) {
      delay(500);
      Serial.print(".");
    }
    
    Serial.println("\nSTA: Connected Success!");
    Serial.print("IP: ");
    Serial.println(WiFi.localIP());
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
  Serial.print("AP Started:\t");
  Serial.println(ssid);
  Serial.print("IP address:\t");
  Serial.println(WiFi.softAPIP());
}
