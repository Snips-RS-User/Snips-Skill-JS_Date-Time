#!/usr/bin/env node

/**
 * Documentation
 * @requires mqtt   need to install mqtt library ">$ npm install mqtt --save"
 */

var mqtt = require('mqtt');


/**
 * Documentation
 * @constant hostmane   IP or hostname of the Raspberry Pi (default="localhost")
 * @constant port       Port connection of the Raspberry Pi (default=1883)
 * @constant INTENT_*   Intent(s) to listen to
 */

const raspi = {
    hostname: "localhost",
    port: 1883
}
const INTENT_TIME = "Snips-RS-User:askTime";
const INTENT_DATE = "Snips-RS-User:askDate";


/**
 * Documentation
 * @function publishTTS
 * @description Announce a message TTS with Snips
 */
var publishTTS = function (message) {
    var sentence = JSON.stringify({ siteId: 'default', init: { type: 'notification', text: message }});
    /** LOG description of the sended sentence */
    console.log("[Snips Log] TTS: sentence=" + message);
    client.publish('hermes/dialogueManager/startSession', sentence);
}


/**
 * Documentation
 * Connection to the Raspberry Pi
 * Listener to intents
 */

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
 * @description define and translate the time in text
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
    return timeText;
};


/**
 * Documentation
 * @function defineDate
 * @param {}
 * @returns {string} a sentence with the date in text format
 * @description define and translate the date in text
 */

var defineDate = function () {
    var dateText = "nous sommes le ";
    var dateObject = new Date();
    var DayTab = ["dimanche", "lundi", "mardi", "mercredi", "jeudi", "vendredi", "samedi"];
    var MonthTab =["janvier", "février", "mars", "avril", "mai", "juin", "juillet", "août", "septembre", "octobre", "novembre", "décembre"];
    dateText += DayTab[dateObject.getDay()] + " ";
    if (dateObject.getDate()==1) {
        dateText += "premier ";
    } else {
        dateText += dateObject.getDate() + " ";
    }
    dateText += MonthTab[dateObject.getMonth()] + " " + dateObject.getFullYear();
    return dateText;
};


/**
 * Documentation
 * @function onIntentDetected
 * @param {*} payload
 * @returns
 * @description Main actions when the listener is detected
 */

var onIntentDetected = function (payload) {
    var ttsText;
    var detectedIntent = false;
    publishTTS("Date et Heure actifs.");
    /** LOG description of the detected intent */
    console.log("[Snips Log] Intent detected: sessionId=" + payload.sessionId + " - siteId=" + payload.siteId);
    console.log("[Snips Log] Intent detected: IntentName=" + payload.intent.intentName + " - Slots=" + JSON.stringify(payload.slots) + " - confidenceScore=" + payload.intent.confidenceScore);
    /** ACTION if INTENT_TIME */
    if (payload.intent.intentName == INTENT_TIME) {
        detectedIntent=true;
        ttsText = defineTime();
    }
    /** ACTION if INTENT_DATE */
    if (payload.intent.intentName == INTENT_DATE) {
        detectedIntent=true;
        ttsText = defineDate();
    }
    /** ACTION send the sentence and close the session */
    if (detectedIntent) {
        var sentence = JSON.stringify({ sessionId: payload.sessionId, text: ttsText });
        /** LOG description of the sended sentence */
        console.log("[Snips Log] TTS: sentence=" + ttsText);
        client.publish('hermes/dialogueManager/endSession', sentence);
    }
};
