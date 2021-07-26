#include <ArduinoJson.h>
#include <U8glib.h>

char str[8];
U8GLIB_SSD1306_128X64 u8g(U8G_I2C_OPT_NONE | U8G_I2C_OPT_DEV_0);

#define LIGHT_SENSOR A0

#include<SoftwareSerial.h>
SoftwareSerial BTSerial(2, 3); //Rx,TX

#include "DHT.h"

#define DHTPIN 7
#define DHTTYPE DHT11   // DHT 11
DHT dht(DHTPIN, DHTTYPE);

void setup() {
  BTSerial.begin(9600); //use the same UART value read at point #8 of the sketch_17
  delay(100);
  Serial.begin(4800);
  pinMode(2, INPUT);
  pinMode(3, OUTPUT);
  u8g.begin();

  dht.begin();
}

void loop() {

  const unsigned long fiveMinutes = 2 * 60 * 1000UL; //da mettere 5 per il progetto vero
  static unsigned long lastSampleTime = 0 - fiveMinutes;  // initialize such that a reading is due the first time through loop()
  unsigned long now = millis();

  delay(2500);

  // Reading temperature or humidity takes about 250 milliseconds!
  // Sensor readings may also be up to 2 seconds 'old' (its a very slow sensor)
  float h = dht.readHumidity();
  float t = dht.readTemperature();

  float lastT;
  float lastH;

  int l = analogRead(LIGHT_SENSOR);

  u8g.firstPage();
  do {
    u8g.setFont(u8g_font_unifont);
    u8g.drawStr(0, 22, "T: ");
    if (!isnan(t)) {
      lastT = t;
      dtostrf(t, 6, 2, str);
    } else {
      dtostrf(lastT, 6, 2, str);
    }
    //dtostrf(t, 6, 2, str);
    u8g.drawStr(30, 22, str);

    u8g.drawStr(0, 42, "H:");
    if (!isnan(h)) {
      lastH = h;
      dtostrf(h, 6, 2, str);
    } else {
      dtostrf(lastH, 6, 2, str);
    }
    //dtostrf(h, 6, 2, str);
    u8g.drawStr(30, 42, str);

    u8g.drawStr(0, 62, "L:");
    dtostrf(l, 6, 2, str);
    u8g.drawStr(30, 62, str);
  }
  while (u8g.nextPage());

  if (now - lastSampleTime >= fiveMinutes)
  {
    lastSampleTime += fiveMinutes;

    DynamicJsonDocument doc(1024);

    if (!isnan(t)) {
      lastT = t;
      doc["extTemp"] = String(t);
    } else {
      doc["extTemp"] = String(lastT);
    }

    if (!isnan(h)) {
      lastH = h;
      doc["extHum"] = String(h);
    } else {
      doc["extHum"] = String(lastH);
    }

    //doc["extTemp"] = String(t);
    //doc["extHum"] = String(h);
    doc["luminosity"] = String(l);

    serializeJson(doc, BTSerial);
  }
}
