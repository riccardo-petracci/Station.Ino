#!/usr/bin/env python3
import logging
from telegram.ext import Updater, CommandHandler, MessageHandler, Filters
import time
import pyrebase
from datetime import date
from config import uid, uid2, db

logging.basicConfig(format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
                    level=logging.INFO)

logger = logging.getLogger(__name__)

def start(update, context):
    update.message.reply_text('Ciao, mi chiamo Stationino! Sono un bot che ti dice in tempo reale delle informazioni riguardo alla Weather Station creata da Riccardo e Corrado. Buon divertimento!\nSe non conosci i comandi clicca qui /help!')

def help(update, context):
    update.message.reply_text('I comandi da utilizzare con questo bot sono:\n/intemp: indica la temperatura interna\n/inthum: indica l\'umidità interna\n/lum: indica la luminosità esterna\n/extemp: indica la temperatura esterna\n/exthum: indica l\'umidità esterna\n/hardware: mostra informazioni dell\'hardware\n/gatewayinfo: mostra informazioni del gateway')

def extemp(update, context):
    extemp = db.child("users/fqYgRTJVTuOPiW7RWkF7a9sdAOH2/raspberryRTSensorsExt/realTime/extTemp").get()
    extemp1 = extemp.val()
    update.message.reply_text('La temperatura esterna è: ' + str(extemp1))

def exthum(update, context):
    exthum = db.child("users/fqYgRTJVTuOPiW7RWkF7a9sdAOH2/raspberryRTSensorsExt/realTime/extHum").get()
    exthum1 = exthum.val()
    update.message.reply_text('L\'umidità esterna è: ' + str(exthum1))

def lum(update, context):
    lum = db.child("users/fqYgRTJVTuOPiW7RWkF7a9sdAOH2/raspberryRTSensorsExt/realTime/luminosity").get()
    lum1 = lum.val()
    update.message.reply_text('La luminosità esterna è: ' + str(lum1))

def intemp(update, context):
    intemp = db.child("users/fqYgRTJVTuOPiW7RWkF7a9sdAOH2/raspberryRTSensors/realTime/temperature").get()
    intemp1 = intemp.val()
    update.message.reply_text('La temperatura interna è: ' + str(intemp1))

def inthum(update, context):
    inthum = db.child("users/fqYgRTJVTuOPiW7RWkF7a9sdAOH2/raspberryRTSensors/realTime/humidity").get()
    inthum1 = inthum.val()
    update.message.reply_text('L\'umidità interna è: ' + str(inthum1))

def hardware(update, context):
    ramtot = db.child("users/fqYgRTJVTuOPiW7RWkF7a9sdAOH2/device/information/Ram_tot").get()
    ramtot1 = ramtot.val()
    ramused = db.child("users/fqYgRTJVTuOPiW7RWkF7a9sdAOH2/device/information/Ram_used").get()
    ramused1 = ramused.val()
    disktot = db.child("users/fqYgRTJVTuOPiW7RWkF7a9sdAOH2/device/information/Disk_tot").get()
    disktot1 = disktot.val()
    diskused = db.child("users/fqYgRTJVTuOPiW7RWkF7a9sdAOH2/device/information/Disk_used").get()
    diskused1 = diskused.val()
    cpu = db.child("users/fqYgRTJVTuOPiW7RWkF7a9sdAOH2/device/information/CPU_Temp").get()
    cpu1 = cpu.val()
    update.message.reply_text('Le informazioni dell\'hardware sono: \nTemperatura CPU: ' + str(cpu1) + ' °C \nRam totale: ' + str(ramtot1) + ' MB \nRam usata: ' + str(ramused1) + ' MB \nDisco totale: ' + str(disktot1) + ' MB \nDisco usato: ' + str(diskused1) + ' MB')

def gatewayinfo(update, context):
    device = db.child("users/fqYgRTJVTuOPiW7RWkF7a9sdAOH2/device/information/device").get()
    device1 = device.val()
    email = db.child("users/fqYgRTJVTuOPiW7RWkF7a9sdAOH2/device/information/service_email").get()
    email1 = email.val()
    ip = db.child("users/fqYgRTJVTuOPiW7RWkF7a9sdAOH2/device/information/IP_Address").get()
    ip1 = ip.val()
    update.message.reply_text("Le informazioni del gateway sono: " + '\nModello device: ' + str(device1) + '\nIndirizzo IP: ' + str(ip1) + '\nEmail di servizio: ' + str(email1))

def echo(update, context):
    update.message.reply_text(update.message.text)

def error(update, context):
    logger.warning('Update "%s" caused error "%s"', update, context.error)

def main():
    updater = Updater("", use_context=True)
    dp = updater.dispatcher
    dp.add_handler(CommandHandler("start", start))
    dp.add_handler(CommandHandler("help", help))
    dp.add_handler(CommandHandler("extemp", extemp))
    dp.add_handler(CommandHandler("exthum", exthum))
    dp.add_handler(CommandHandler("lum", lum))
    dp.add_handler(CommandHandler("intemp", intemp))
    dp.add_handler(CommandHandler("inthum", inthum))
    dp.add_handler(CommandHandler("hardware", hardware))
    dp.add_handler(CommandHandler("gatewayinfo", gatewayinfo))
    dp.add_handler(MessageHandler(Filters.text, echo))
    dp.add_error_handler(error)
    updater.start_polling()
    updater.idle()

if __name__ == '__main__':
    main()
