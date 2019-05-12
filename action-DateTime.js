#!/usr/bin/env node

var mqtt = require('mqtt');

var raspi = {
    hostname: "localhost",
    port: 1883
}

const INTENT_TIME = "Snips-RS-User:askTime";
const INTENT_DATE = "Snips-RS-User:askDate";
const TTS_SAY = "hermes/tts/say";
const TTS_FINISHED = "hermes/tts/sayFinished";

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
 * @returns {string} a sentence with the time in text format
 * @description define and translate time in text
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
 * @returns
 * @description Main actions when the listener is detected
 */
var onIntentDetected = function (payload) {
    var ttsText;
    console.log("[Snips Log] Intent detected: sessionId=" + payload.sessionId + " - siteId=" + payload.siteId);
    console.log("[Snips Log] Intent detected: IntentName=" + payload.intent.intentName + " - Slots=" + JSON.stringify(payload.slots) + " - confidenceScore=" + payload.intent.confidenceScore);
    if (payload.intent.intentName == INTENT_TIME) {
        console.log("[Snips Log] Intent detected: Activate function Time");
        ttsText = defineTime();
        console.log("[Snips Log] TTS : Text=" + ttsText);
        var message = JSON.stringify({ sessionId: payload.sessionId, text: ttsText });
        console.log("[Snips Log] TTS : JSON message=" + JSON.stringify(message));
        client.publish('hermes/dialogueManager/endSession', message);
        console.log("[Snips Log] TTS : send and close the session");
        /* client.subscribe('hermes/dialogueManager/continueSession', function (err) {
            if (!err) {
                console.log("[Snips Log] Subscription StartSession OK");
                client.publish('hermes/tts/say', "C'est l'heure");
                console.log("[Snips Log] Publish TTS OK");
                client.publish('hermes/tts/sayFinished');
                console.log("[Snips Log] Publish TTS End");
            }
        })
        */
    }
    if (payload.intent.intentName == INTENT_DATE) {
        console.log("[Snips Log] Intent detected: Activate function Date");
    }
}


