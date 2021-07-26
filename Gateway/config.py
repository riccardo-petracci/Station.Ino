### Configuration Module ###
import pyrebase

config = {
    "apiKey": "XXX",
    "authDomain": "XXX",
    "databaseURL": "XXX",
    "projectId": "stationino-f6845",
    "storageBucket": "XXX",
    "messagingSenderId": "XXX",
    "appId": "XXX",
    "measurementId": "XXX",
    "serviceAccount": "XXX"
}

firebase = pyrebase.initialize_app(config)
db = firebase.database()

"""
auth = firebase.auth()

#credential for login
email = input("Insert your gateway email\n")
password = input("Insert your gateway passord\n")

user = auth.sign_in_with_email_and_password(email,password)
"""

#uid in un prodotto reale in commercio dovrebbe essere reperito tramite pairing
#dove l'utente si autentica al Raspberry PI e tramite login diciamo fornisce
#al Pi il uid firebase che poi il rapsberry utilizzerà per scrivere i dati degli arduini

#sulla relazione verrà scritto che essendo un prototipo viene inserito l'uid
#nel file config

uid  = "fqYgRTJVTuOPiW7RWkF7a9sdAOH2"
uid2 = "J1BZP3ISOVNCEJ3pElpP6vXaVa13"
