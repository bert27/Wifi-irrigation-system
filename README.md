# Wifi-irrigation-system

This is an implementation of https://github.com/me-no-dev/ESPAsyncWebServer.

From here, I want to give you my thanks.

It's about controlling the esp8266 or esp32 through react.
For those of you who don't know these microcontrollers, they are very cheap and offer the ability to build robots or whatever you want.

I have resumed this project, to create an ultra compact cocktail machine with more than 7 water pumps.
I leave the old code that is used to create tasks and look through a relay and a single water pump.
The idea is to add pwm control with a power stage based on mosfets.
Pipe adapters with reducers and a much better user experience.
For this, I am using all my current knowledge and have added ui material with react to the latest version using modular typescript and following the practices of atomic structures.
Ideas or questions are accepted, have a good day :)

<div classname="center">
<img src="https://camo.githubusercontent.com/37d5b283622606fb7fcee3d6767f9128871c6c2b44121b7abe308d85e443e917/68747470733a2f2f692e6962622e636f2f356b4d524467672f706c616e74612e706e67" >
</div>

In progress: 

#define waterPump1 16 // waterpump in PIN D0
#define waterPump2 5  // waterpump in PIN D1
#define waterPump3 4  // waterpump in PIN D2
#define waterPump4 0  // waterpump in PIN D3

#define pinClock1 14 // OPTIONAL CLOCK PIN 1 IN D5
#define pinClock2 12 // OPTIONAL CLOCK PIN 2 IN D6

--------

To run the client, inside the client folder: 

1.npm install   <--- only first time
2.npm start.

To run the server, inside the server folder: 

Load the sketch of the server in the esp8266 using the arduino ide and the com port connected by usb

--------
In conf change the name and password of your wifi
--------

Full responsive design with sass

----

if it has trouble booting, it requires python 3

