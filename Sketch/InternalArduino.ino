#include <ArduinoJson.h>
// Date and time functions using a DS1307 RTC connected via I2C and Wire lib
#include "RTClib.h"
RTC_DS1307 rtc;

int buttonPin = 4;

#include<SoftwareSerial.h>
SoftwareSerial BTSerial(2, 3); //Rx,TX

#include "DHT.h"

#define DHTPIN 7
#define DHTTYPE DHT11   // DHT 11
DHT dht(DHTPIN, DHTTYPE);

#include "rgb_lcd.h"
rgb_lcd lcd;

char daysOfTheWeek[7][12] = {"Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"};

void setup() {

  BTSerial.begin(9600); //use the same UART value read at point #8 of the sketch_17
  delay(100);
  //Serial.begin(4800);

  lcd.begin(16, 2);
  lcd.clear();
  lcd.setCursor(0, 0);
  lcd.print("Station.Ino");
  delay(5000);
  lcd.clear();

  pinMode(2, INPUT);
  pinMode(3, OUTPUT);
  pinMode(buttonPin, INPUT);

  dht.begin();

  while (!Serial);

  //Serial.begin(9600);
  Serial.begin(4800);
  if (! rtc.begin()) {
    Serial.println("Couldn't find RTC");
    while (1);
  }

  if (! rtc.isrunning()) {
    Serial.println("RTC is NOT running!");
    // following line sets the RTC to the date & time this sketch was compiled
    rtc.adjust(DateTime(F(__DATE__), F(__TIME__)));
    // This line sets the RTC with an explicit date & time, for example to set
    // January 21, 2014 at 3am you would call:
    // rtc.adjust(DateTime(2014, 1, 21, 3, 0, 0));
  }
}

void loop() {

  const unsigned long fiveMinutes = 3 * 60 * 1000UL; //da mettere 5 per il progetto vero
  static unsigned long lastSampleTime = 0 - fiveMinutes;  // initialize such that a reading is due the first time through loop()
  unsigned long ora = millis();

  delay(2500);

  // Reading temperature or humidity takes about 250 milliseconds!
  // Sensor readings may also be up to 2 seconds 'old' (its a very slow sensor)
  float h = dht.readHumidity();
  // Read temperature as Celsius (the default)
  float t = dht.readTemperature();

  float lastT;
  float lastH;

  DateTime now = rtc.now();

  if (digitalRead(buttonPin) == LOW) {
    //LCD SENSORS
    lcd.clear();
    lcd.setCursor(0, 0);
    lcd.print("Temp: ");
    if (!isnan(t)) {
      lastT = t;
      lcd.print(t);
    } else {
      lcd.print(lastT);
    }
    lcd.print(" C");
    lcd.setCursor(0, 1);
    lcd.print("Hum: ");
    if (!isnan(h)) {
      lastH = h;
      lcd.print(h);
    } else {
      lcd.print(lastH);
    }
    lcd.print("%");
    //delay(1000);
    //lcd.clear();
  }
  if (digitalRead(buttonPin) == HIGH) {
    //LCD TIME
    lcd.clear();
    lcd.setCursor(0, 0);
    lcd.print(now.day());
    lcd.print("/");
    lcd.print(now.month());
    lcd.print("/");
    lcd.print(now.year());
    lcd.setCursor(0, 1);
    lcd.print(now.hour());
    lcd.print(":");
    lcd.print(now.minute());
    lcd.print(":");
    lcd.print(now.second());
    //delay(1000);
    //lcd.clear();
  }

  String datiBT = BTSerial.readString();
  Serial.println(datiBT);

  if (ora - lastSampleTime >= fiveMinutes)
  {
    lastSampleTime += fiveMinutes;

    const size_t capacity = JSON_OBJECT_SIZE(1) + 64;
    DynamicJsonDocument doc(capacity);

    if (!isnan(t)) {
      lastT = t;
      doc["temperature"] = String(t);
    } else {
      doc["temperature"] = String(lastT);
    }

    if (!isnan(h)) {
      lastH = h;
      doc["humidity"] = String(h);
    } else {
      doc["humidity"] = String(lastH);
    }

    //doc["temperature"] = String(t);
    //doc["humidity"] = String(h);
    doc["date"] = String(now.day()) + "/" + String(now.month()) + "/" + String(now.year());
    doc["time"] = String(now.hour()) + ":" + String(now.minute()) + ":" + String(now.second());

    serializeJson(doc, Serial);
    Serial.println("");
  }
}
