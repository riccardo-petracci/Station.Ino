#!/usr/bin/env python3
import serial

#conversione json
import simplejson as json

import time
import pyrebase
from datetime import date
from config import uid, uid2, db

from time import sleep
import datetime
import os
import socket

###################### Start Script ############################

h_name = socket.gethostname()
IP_addres = socket.gethostbyname(h_name)
#print("Host Name is:" + h_name)
#print("Computer IP Address is:" + IP_addres)

# Return CPU temperature as a character string                                      
def getCPUtemperature():
    res = os.popen('vcgencmd measure_temp').readline()
    return(res.replace("temp=","").replace("'C\n",""))

# Return RAM information (unit=kb) in a list                                        
# Index 0: total RAM                                                                
# Index 1: used RAM                                                                 
# Index 2: free RAM                                                                 
def getRAMinfo():
    p = os.popen('free')
    i = 0
    while 1:
        i = i + 1
        line = p.readline()
        if i==2:
            return(line.split()[1:4])

# Return information about disk space as a list (unit included)                     
# Index 0: total disk space                                                         
# Index 1: used disk space                                                          
# Index 2: remaining disk space                                                     
# Index 3: percentage of disk used                                                  
def getDiskSpace():
    p = os.popen("df")
    i = 0
    while 1:
        i = i +1
        line = p.readline()
        if i==2:
            return(line.split()[1:5])


ser = serial.Serial('/dev/ttyACM0',4800)

buffer = ""

while True:
    try:
            #Json con le info
            DISK_stats = getDiskSpace()
            RAM_stats = getRAMinfo()
            
            info={
                "device" : socket.gethostname(),
                "IP_Address" : socket.gethostbyname(h_name),
                "service_email" : "firebase-adminsdk-657vt@stationino-f6845.iam.gserviceaccount.com",
                "CPU_Temp" : getCPUtemperature(),
                "Ram_tot" : round(int(RAM_stats[0]) / 1000,1),
                "Ram_used" : round(int(RAM_stats[1]) / 1000,1),
                "Disk_tot" : DISK_stats[0],
                "Disk_used" : DISK_stats[1],
            }
            
            db.child("users/"+uid).child("device").child("information").set(info)
            buffer = ser.readline()
            print(buffer)
            data = json.loads(buffer)
            
            if ('extTemp' in data) == True:
                db.child("users/"+uid).child("raspberryRTSensorsExt").child("realTime").set(data)
                db.child("users/"+uid).child("raspberrySensorsExt").child("storeData").push(data)

            elif ('temperature' in data) == True:
                db.child("users/"+uid).child("raspberryRTSensors").child("realTime").set(data)
                db.child("users/"+uid).child("raspberrySensors").child("storeData").push(data)
                
            buffer = ""
            print(" ")
            
    except json.JSONDecodeError:
            print("Error : try to parse an incomplete message")
            continue
