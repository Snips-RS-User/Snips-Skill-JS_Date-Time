#!/usr/bin/env node

var mqtt = require('mqtt');

var raspi= {
    hostname: "localhost",
    port: 1883
}

INTENT_TIME = "Snips-RS-User:askTime";
INTENT_DATE = "Snips-RS-User:askDate";

var client  = mqtt.connect('mqtt://' + raspi.hostname, raspi.port);


client.on('connect', function () {
    console.log("[Snips Log] Connected to MQTT broker " + raspi.hostname + ":" + raspi.port);
    if (client.subscribe('hermes/#')){
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


var onIntentDetected = function (payload) {
    console.log("[Snips Log] Intent detected: sessionId="+ payload.sessionId + " - siteId=" + payload.siteId);
    console.log("[Snips Log] Intent detected: IntentName="+ payload.intentName + " - Slots=" + JSON.stringify(payload.slots) + " - confidenceScore=" + payload.confidenceScore);
    if (payload.intentName === "INTENT_TIME") {
        console.log("[Snips Log] Intent detected: Activate function Time");
    }
    if (payload.intentName === "INTENT_DATE") {
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
