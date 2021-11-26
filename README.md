# Wifi-irrigation-system


Using esp8266 and react to create scheduled irrigation tasks.

Currently only tasks are created and loaded.

It remains to add the possibility of deleting them and saving the esp8266 in eeprom memory.

<div classname="center">
<img src="https://i.ibb.co/5kMRDgg/planta.png" >
</div>



--------

To run the client, inside the client folder: 

1.npm install   <--- only first time
2.npm start.

To run the server, inside the server folder: 

Load the sketch of the server in the esp8266 using the arduino ide and the com port connected by usb

--------

*The server is required to act as a proxy and bypass cors restrictions.
 Allows you to build an api with third party urls.


This example uses mocha to test node as Server  and joke to test react as client.

--------

Full responsive design with sass
