#include <ESP8266WiFi.h>
#include <WiFiClient.h> 
#include <ESP8266WebServer.h>

using namespace std;

ESP8266WebServer server(80);

const int blue = 16;
const int green = 4;
const int red = 2;
const int R_DEFAULT = 255;
const int G_DEFAULT = 255;
const int B_DEFAULT = 0;

int r = 0, g = 0, b = 0;
bool isOn = false;

void setRgb(){
  r = server.arg("r").toInt();
  g = server.arg("g").toInt();
  b = server.arg("b").toInt();
  server.send(200, "text/json", "{}");
}

void toggleOnOff(){
  if(isOn){
    r = 0;
    g = 0;
    b = 0;
  } else {
    r = R_DEFAULT; 
    g = G_DEFAULT;
    b = B_DEFAULT;
  }
  isOn = !isOn;
  server.send(200, "text/json", "{}");
}

void setColor(){
  digitalWrite(red, r);
  digitalWrite(green, g);
  digitalWrite(blue, b);
}

void handleNotFound(){
  String message = "File Not Found\n\n";
  message += "URI: ";
  message += server.uri();
  message += "\nMethod: ";
  message += (server.method() == HTTP_GET)?"GET":"POST";
  message += "\nArguments: ";
  message += server.args();
  message += "\n";
  for (uint8_t i=0; i<server.args(); i++){
    message += " " + server.argName(i) + ": " + server.arg(i) + "\n";
  }
  server.send(404, "text/plain", message);
}

void setup(void){
  delay(1000);
  Serial.begin(115200);
  Serial.println();
  Serial.print("Configuring access point...");
  WiFi.softAP("Lampshade FKD");

  IPAddress myIP = WiFi.softAPIP();
  Serial.print("AP IP address: ");
  Serial.println(myIP);

  server.on("/toggleOnOff", toggleOnOff);
  server.on("/setRgb", setRgb);
  server.onNotFound(handleNotFound);

  server.begin();
  Serial.println("HTTP server started");

  pinMode(blue, OUTPUT);
  pinMode(green, OUTPUT);
  pinMode(red, OUTPUT);
}

void loop(void){  
  server.handleClient();
  setColor();
}