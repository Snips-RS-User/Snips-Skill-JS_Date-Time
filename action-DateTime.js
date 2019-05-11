#!/usr/bin/env node

var mqtt = require('mqtt');

var raspi = {
    hostname: "localhost",
    port: 1883
}

INTENT_TIME = "Snips-RS-User:askTime";
INTENT_DATE = "Snips-RS-User:askDate";
CHANNEL_TTS = "";

var client = mqtt.connect('mqtt://' + raspi.hostname, raspi.port);


client.on('connect', function () {
    console.log("[Snips Log] Connected to MQTT broker " + raspi.hostname + ":" + raspi.port);
    if (client.subscribe('hermes/#')) {
        console.log("[Snips Log] Subscription to /hermes/# is OK");
    } else {
        console.log("[Snips Log] ERROR - Subscription to /hermes/# is KO");
    }
});

client.on('message', function (topic, payload) {
    if (topic.match(/hermes\/intent\/.+/g) !== null) {
        onIntentDetected(JSON.parse(payload));
    }
});


/**
 * Documentation
 * @function defineTime
 * @param {}
 * @description define and translate time in text
 * @returns {string} a sentence with the time in text format
 */
var defineTime = function () {
    var timeText = "il est ";
    var timeObject = new Date();
    switch (timeObject.getHours()) {
        case 0:
            timeText += "minuit";
            break;
        case 1:
            timeText += "une heure";
            break;
        case 12:
            timeText += "midi";
            break;
        case 21:
            timeText += "vingt et une heures";
            break;
        default:
            timeText += timeObject.getHours() + " heures";
            break;
    }
    switch (timeObject.getMinutes()) {
        case 0:
            timeText += "";
            break;
        case 1:
            timeText += " une";
            break;
        case 21:
            timeText += " vingt et une";
            break;
        case 31:
            timeText += " trente et une";
            break;
        case 41:
            timeText += " quarante et une";
            break;
        case 51:
            timeText += " cinquante et une";
            break;
        default:
            timeText += " " + timeObject.getMinutes();
            break;
    }
    return timeText
}


/**
 * Documentation
 * @function onIntentDetected
 * @param {*} payload 
 */
var onIntentDetected = function (payload) {
    console.log("[Snips Log] Intent detected: sessionId=" + payload.sessionId + " - siteId=" + payload.siteId);
    console.log("[Snips Log] Intent detected: IntentName=" + payload.intent.intentName + " - Slots=" + JSON.stringify(payload.slots) + " - confidenceScore=" + payload.intent.confidenceScore);
    if (payload.intent.intentName == INTENT_TIME) {
        console.log("[Snips Log] Intent detected: Activate function Time");
        console.log(defineTime());
    }
    if (payload.intent.intentName == INTENT_DATE) {
        console.log("[Snips Log] Intent detected: Activate function Date");
    }
}



/* *************************************************** */
/*
const ini = require('ini')
const fs = require('fs')

const { withHermes } = require('hermes-javascript')
//const configFile = fs.readFileSync('./config.ini', 'utf8')
//const config = ini.parse(configFile)

withHermes((hermes, done) => {
    try {
        // Instantiate a dialog object
        const dialog = hermes.dialog()

        // Subscribes to intent 'Snips-RS-User:askDate'
        dialog.flow('Snips-RS-User:askTime', async (message, flow) => {

        // Log intent message
        console.log(JSON.stringify(message));

        // End the session
        flow.end();

        // Use text to speech
        return `message recu`
        })
    } catch (error) {
        console.error(error.toString())
        done()
    }
})

*/

/* ******************************* */
