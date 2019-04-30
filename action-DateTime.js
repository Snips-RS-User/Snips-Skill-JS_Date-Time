#!/usr/bin/env node
/*
var mqtt = require('mqtt');

var hostname = "localhost";
var client  = mqtt.connect('mqtt://' + hostname, { port: 1883 });

client.on('connect', function () {
    console.log("[Snips Log] Connected to MQTT broker " + hostname);
    client.subscribe('hermes/#');
});

client.on('message', function (topic, payload) {
    if (topic === "hermes/asr/startListening") {
        onListeningStateChanged("Start");
    } else if (topic === "hermes/asr/stopListening") {
        onListeningStateChanged("Stop");
    } else if (topic.match(/hermes\/hotword\/.+\/detected/g) !== null) {
        onHotwordDetected()
    } else if (topic.match(/hermes\/intent\/.+/g) !== null) {
        onIntentDetected(JSON.parse(payload));
    }
});

function onListeningStateChanged(listening) {
    console.log("[Snips Log] " + listening + " listening");
}

function onHotwordDetected() {
    console.log("[Snips Log] Hotword detected");
}

function onIntentDetected(payload) {
    var sessionId = payload["sessionId"];
    var siteId = payload["siteId"];
    var intentName = payload["intent"]["intentName"];
    var confidenceScore = payload["intent"]["confidenceScore"];
    var slots = payload["slots"];
    console.log("[Snips Log] Intent detected: sessionId="+ sessionId + " - siteId=" + siteId);
    console.log("[Snips Log] Intent detected: IntentName="+ intentName + " - Slots=" + JSON.stringify(slots) + " - confidenceScore=" + confidenceScore);
    if (intentName === "Snips-RS-User:test1") {

    }
    if (intentName === "Snips-RS-User:test2") {

    }
    if (intentName === "Snips-RS-User:test3") {

    }
}

*/


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
        dialog.flow('intent/{{Snips-RS-User:askTime}}', async (message, flow) => {

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






/* ******************************* */
