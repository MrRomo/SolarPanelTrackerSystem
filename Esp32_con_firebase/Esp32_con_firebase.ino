#include <WiFi.h>
#include "FirebaseESP32.h"

#define FIREBASE_HOST "https://solar-trackin-panel.firebaseio.com"
#define FIREBASE_AUTH "Ru26GBAd4ZwnT1UUSNhjrzMNde71tHPsG5Zf0WdQ"
#define WIFI_SSID "Wi-Fi Unimagdalena" //"JR2GWIFI"
#define WIFI_PASSWORD "" //"ADBAE5FA"

int sensorPin = A0;                 // References A0 analog pin
const int potPin= 34;  

// variable for storing the potentiometer value
int potValue = 0;

//temp variables
const int tempPin = 34;
const int refPin = 35; 
const int panelPin = 32; 

int RawValue= 0;
int RefValue = 0;

double Voltage = 0;
double RefVoltage = 0;
double panelVoltage = 0;
double RefTemp = 0;
double tempC = 0;
double tempF = 0;




FirebaseData firebaseData;
char ssid[15]; //Create a Unique AP from MAC address

int c = 0;
float MEASURE_DELAY_SEC = 0.1;
#define LED_BUILTIN 2

void setup() {
  Serial.begin(115200);
  delay(10);
  pinMode(LED_BUILTIN, OUTPUT);
  digitalWrite(LED_BUILTIN, 1);

  // We start by connecting to a WiFi network
  Serial.println();
  Serial.println();
  Serial.print("Connecting to ");
  Serial.println(WIFI_SSID);

  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);

  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }

  Serial.println("");
  Serial.println("WiFi connected");
  Serial.println("IP address: ");
  Serial.println(WiFi.localIP());

  // Let's connect to Firebase
  Firebase.begin(FIREBASE_HOST, FIREBASE_AUTH);
  Firebase.reconnectWiFi(true);

  uint64_t chipid = ESP.getEfuseMac(); //The chip ID is essentially its MAC address(length: 6 bytes).
  uint16_t chip = (uint16_t)(chipid >> 32);
  snprintf(ssid, 15, "ESP32-%04X", chip);
  Serial.printf("ESP32 Chip ID = %S", ssid); //print High 2 bytes


}

void loop() {

  // Let's measure analog value and print it
  float temp = readTemp();
  
  Serial.println("Temp: " + String(temp) + " Ref: " + String(RefTemp) + " Voltage: " + String(panelVoltage));
  // Let's push it in firebase Realtime Database
  if (c = 10) {
    Firebase.setString(firebaseData, "/devices/" + String(ssid) + "/data", String(temp) + "-" + String(panelVoltage) + "-" + String(RefTemp));
  }
  //Firebase.setString(firebaseData, "/devices/" + String(ssid) + "/angle", String(angle));


  // Blink LED when it's done
  digitalWrite(LED_BUILTIN, 0);
  delay(50);
  digitalWrite(LED_BUILTIN, 1);
  delay(50);

  // Wait before looping
  delay(MEASURE_DELAY_SEC * 1000);
}


double readTemp() {
  RefValue = analogRead(refPin);
  RawValue = analogRead(tempPin);
  panelVoltage = analogRead(panelPin);
  Serial.println("Panel Raw Voltage: " + String(panelVoltage));
  panelVoltage = (panelVoltage/ 4096.0) * 3300; 
  Voltage = (RawValue / 2048.0) * 3300; // 5000 to get millivots.
  RefVoltage = (RefValue / 2048.0) * 3300; // 5000 to get millivots.
  tempC = Voltage * 0.1;
  RefTemp = RefVoltage * 0.1;
  tempF = (tempC * 1.8) + 32; // conver to F
  return tempC;
}
