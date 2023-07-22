#include "WString.h"
#include <RTClib.h>
#include <ArduinoJson.h>
#include "AsyncJson.h"

RTC_DS3231 rtc;

const char *DiasSemana[] = { "Lunes", "Martes", "Miercoles", "Jueves", "Viernes", "Sabado", "Domingo" };
// PINOUTS - GPIOS:
#define waterPump1 0  // waterpump in PIN D3
#define waterPump2 2  // waterpump in PIN D4
#define waterPump3 16  // waterpump in PIN D5
#define waterPump4 15  // waterpump in PIN D6

#define pinClock1 1  // OPTIONAL CLOCK PIN 1 IN D7
#define pinClock2 3  // OPTIONAL CLOCK PIN 2 IN D8

AsyncWebServer server(80);
int positionInList = 0;
int MaxpositionInList = 20;
String ArrayList[3][20];
const char index_html[] PROGMEM = R"rawliteral(
<!DOCTYPE HTML><html>
<head>
  <title>ESP Web Server</title>
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <link rel="icon" href="data:,">
  <style>
    html {font-family: Arial; display: inline-block; text-align: center;}
    h2 {font-size: 3.0rem;}
    p {font-size: 3.0rem;}
    body {max-width: 600px; margin:0px auto; padding-bottom: 25px;}
    .switch {position: relative; display: inline-block; width: 120px; height: 68px} 
    .switch input {display: none}
    .slider {position: absolute; top: 0; left: 0; right: 0; bottom: 0; ba<ckground-color: #ccc; border-radius: 6px}
    .slider:before {position: absolute; content: ""; height: 52px; width: 52px; left: 8px; bottom: 8px; background-color: #fff; -webkit-transition: .4s; transition: .4s; border-radius: 3px}
    input:checked+.slider {background-color: #b30000}
    input:checked+.slider:before {-webkit-transform: translateX(52px); -ms-transform: translateX(52px); transform: translateX(52px)}
  </style>
</head>
<body>
  <h2>Servidor Web</h2>
  

</body>
</html>
)rawliteral";

void homeRequest(AsyncWebServerRequest *request) {
  request->send(200, "text/plain", "Servidor robot");
}

void notFound(AsyncWebServerRequest *request) {
  request->send(404, "text/plain", "Not found");
}

void AddTask(String day, String hours, String minutes) {
  Serial.println("Estableciendo riego para el día: " + day);
  Serial.println("A las " + hours + ":" + minutes);
  /*
        class alarm { //creating a class
  char day[20];
  char hours[20];
  char minutes[20];
  }
  alarm s1;
  s1.day = day; //assigning values to class members
  s1.hours = hours;
  s1.minutes = minutes;*/
  Serial.println("check");
  if (positionInList > MaxpositionInList) {
    Serial.println("check4");
  }
  if (positionInList < MaxpositionInList) {
    Serial.println("check2");
    // String ArrayList[3][positionInList]={{day}, {hours}, {minutes}};

    ArrayList[0][positionInList] = day;
    ArrayList[1][positionInList] = hours;
    ArrayList[2][positionInList] = minutes;
    Serial.println("posicion: " + String(positionInList));
    positionInList++;
    Serial.println("Añadiendo elemento en la lista");

    // Show elements list
    Serial.println("////////");
    for (int i = 0; i < MaxpositionInList; i++) {
      Serial.println(ArrayList[0][i]);
      Serial.println(ArrayList[1][i]);
      Serial.println(ArrayList[2][i]);
    }
    Serial.println("////////");
  }

  /*
                            String newiInList[] = {day, hours, minutes};
                             list.Add(newiInList);
                              Serial.println("Elementos de la lista:");
                                      for (int i = 0; i < list.Count(); i++){
                                                            Serial.println(list[i]);
                                                          }
  */
}
String getClock() {
  DateTime now;
  now = rtc.now();
  char buffer[25] = "";
  sprintf(buffer, "%02d:%02d:%02d %02d/%02d/%04d", now.hour(), now.minute(), now.second(), now.day(), now.month(), now.year());

  return buffer;
}



void InitServer() {


  // https://techtutorialsx.com/2017/12/17/esp32-arduino-http-server-getting-query-parameters/
  // https://github.com/esp8266/Arduino/blob/master/libraries/ESP8266WebServer/README.rst
  server.on("/waterPump1OnOFF", HTTP_GET, [](AsyncWebServerRequest *request) {
    Serial.println("Mensaje GET RECIBIDO");
    String nParams;
    nParams = request->params();

    AsyncWebParameter *param1 = request->getParam(0);
    String idValue = param1->value();
    AsyncWebParameter *param2 = request->getParam(1);
    int pwmValue = param2->value().toInt();
    AsyncWebParameter *param3 = request->getParam(2);
    String timeCalibrationValue = param3->value();

    switch (idValue.toInt()) {
      case 1:
        pinMode(waterPump1, OUTPUT);
        analogWrite(waterPump1, pwmValue);
        break;
      case 2:
        pinMode(waterPump2, OUTPUT);
        analogWrite(waterPump2, pwmValue);
        break;
      case 3:
        pinMode(waterPump3, OUTPUT);
        analogWrite(waterPump3, pwmValue);
        break;
      case 4:
        pinMode(waterPump4, OUTPUT);
        analogWrite(waterPump4, pwmValue);
        break;
      default:
        // Invalid idValue
        break;
    }

    request->send(200, "text/plain", "OK");
  });

#ifndef ESP8266
  while (!Serial)
    ;  // wait for serial port to connect. Needed for native USB
#endif
  if (!rtc.begin()) {
    Serial.println("Couldn't find RTC");
    Serial.flush();
    // while (1) delay(10);
    rtc.adjust(DateTime((__DATE__), (__TIME__)));
  }

  if (rtc.lostPower()) {
    Serial.println("RTC lost power, let's set the time!");
    rtc.adjust(DateTime(F(__DATE__), F(__TIME__)));
  }
  server.on("/", HTTP_GET, homeRequest);
  server.on("/item", HTTP_GET, getRequest);

  server.on(
    "/control", HTTP_POST, [](AsyncWebServerRequest *request) {}, NULL, postRequest);
  server.on(
    "/item", HTTP_POST, [](AsyncWebServerRequest *request) {}, NULL, postRequest);
  server.on(
    "/item", HTTP_PUT, [](AsyncWebServerRequest *request) {}, NULL, putRequest);
  server.on(
    "/item", HTTP_PATCH, [](AsyncWebServerRequest *request) {}, NULL, patchRequest);
  server.on("/item", HTTP_DELETE, deleteRequest);
  server.on("/getClock", HTTP_GET, [](AsyncWebServerRequest *request) {
    request->send(200, "text/plain", getClock());
  });

  server.on("/getList", HTTP_GET, [](AsyncWebServerRequest *request) {
    String alldata;
    for (int i = 0; i < MaxpositionInList; i++) {
      alldata = alldata + (ArrayList[0][i] + "-" + ArrayList[1][i] + "-" + ArrayList[2][i]) + "/";
    };

    request->send(200, "text/plain", alldata);
  });
  server.on("/getTemperature", HTTP_GET, [](AsyncWebServerRequest *request) {
    char str[32] = "";
    dtostrf(rtc.getTemperature(), 8, 2, str);
    request->send(200, "text/plain", str);
  });

  server.on("/addTaskEsp", HTTP_GET, [](AsyncWebServerRequest *request) {
    int paramsNr = request->params();
    // Serial.println(paramsNr);
    String minutesRecibed = "";
    String hourRecibed = "";
    for (int i = 0; i < paramsNr; i++) {
      AsyncWebParameter *p = request->getParam(i);
      String nameParametre = p->name();
      String valueParametre = p->value();

      // Serial.print("Param name: ");
      // Serial.println(nameParametre);
      //  Serial.print("Param value: ");
      //  Serial.println(valueParametre);
      Serial.println("//////////////////////");
      if (nameParametre == "minutes") {
        // Serial.print("Establenciendo minutos ");
        minutesRecibed = valueParametre;
      }
      if (nameParametre == "hour") {
        //   Serial.print("Establenciendo hora ");
        hourRecibed = valueParametre;
      }
      if (nameParametre == "days") {
        Serial.println("Establenciendo nuevos Riegos:");
        Serial.println("//////////////////////");

        int str_len = valueParametre.length() + 1;
        char char_array[str_len];
        valueParametre.toCharArray(char_array, str_len);


        char *daysArray = strtok(char_array, ",");
        byte i = 0;
        byte m = 0;
        while (daysArray != NULL) {


          String newdata = String(daysArray).substring(0, 1);
          String newdataValue = String(daysArray).substring(1, 2);

          //Solo se ejecutara la tarea añadir riego cuando el día sea recibido en true
          if (newdataValue == "s") {

            String result = String(daysArray);
            int result_leng = result.length();

            String trueOrFalse = result.substring(8, 9);
            if (trueOrFalse == "t") {
              // Serial.println("Estableciendo riego para el día: " +  String(DiasSemana[m]) );
              // Serial.println("A las " + hourRecibed +":" + minutesRecibed);

              AddTask(String(DiasSemana[m]), hourRecibed, minutesRecibed);
            }

            m++;
          }

          daysArray = strtok(NULL, ",");
          i++;
        }
      }
    }




    request->send(200, "text/plain", "apagado");
  });
  server.onNotFound(notFound);

  DefaultHeaders::Instance().addHeader("Access-Control-Allow-Origin", "*");

  server.begin();
  Serial.println("HTTP server started");
}
