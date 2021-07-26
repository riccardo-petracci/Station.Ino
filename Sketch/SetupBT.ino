//Setup BT

#include<SoftwareSerial.h>
SoftwareSerial BTSerial(2,3);

void setup() {
  // put your setup code here, to run once:
  Serial.begin(38400);
  BTSerial.begin(38400);
}

void loop() {
  // put your main code here, to run repeatedly:
  if(BTSerial.available()){
    Serial.write(BTSerial.read());
  }
  if(Serial.available()){
    BTSerial.write(Serial.read());
  }
  delay(10);
}
