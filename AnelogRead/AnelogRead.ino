// Potentiometer is connected to GPIO 34 (Analog ADC1_CH6) 
const int potPin = 34;

// variable for storing the potentiometer value
int potValue = 0;

void setup() {
  Serial.begin(115200);
  delay(1000);
  Serial.println("INICIANDO MEDICIONES");
}

int readAngle() {
  // Reading potentiometer value
  potValue = analogRead(potPin);
  Serial.println(potValue);
  angle = portValue*360/4095;
  return return
}
