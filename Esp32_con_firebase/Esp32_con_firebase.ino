#include <WiFi.h>
#include "FirebaseESP32.h"

#define FIREBASE_HOST "https://solar-trackin-panel.firebaseio.com"
#define FIREBASE_AUTH "Ru26GBAd4ZwnT1UUSNhjrzMNde71tHPsG5Zf0WdQ"
#define WIFI_SSID "JR2GWIFI"
#define WIFI_PASSWORD "ADBAE5FA"
int sensorPin = A0;                 // References A0 analog pin
int sensorValue;                    // 10-bit equivalent value of analog signal
// Potentiometer is connected to GPIO 34 (Analog ADC1_CH6)
const int potPin = 34;

// variable for storing the potentiometer value
int potValue = 0;


FirebaseData firebaseData;
char ssid[15]; //Create a Unique AP from MAC address

int c = 0;
float MEASURE_DELAY_SEC = 0.3;
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
  float voltage = random(1, 5);
  float temp = random(20, 35);
  float angle = readAngle();

  Serial.println("Values: "+ String(sensorValue) + " Angle: " + String(angle));
  // Let's push it in firebase Realtime Database
  if (c = 10) {
    Firebase.setString(firebaseData, "/devices/" + String(ssid) + "/data", String(temp) + "-" + String(voltage));
  }
  Firebase.setString(firebaseData, "/devices/" + String(ssid) + "/angle", String(angle));


  // Blink LED when it's done
  digitalWrite(LED_BUILTIN, 0);
  delay(50);
  digitalWrite(LED_BUILTIN, 1);
  delay(50);

  // Wait before looping
  delay(MEASURE_DELAY_SEC * 1000);
}


float readAngle() {
  // Reading potentiometer value
  potValue = analogRead(potPin);
  Serial.println(potValue);
  float angle = potValue * 360 / 4095;
  return angle;
}
