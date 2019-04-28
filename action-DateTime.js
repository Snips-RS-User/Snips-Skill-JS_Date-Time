#!/usr/bin/env node

const ini = require('ini')
const fs = require('fs')

const { withHermes } = require('hermes-javascript')
const configFile = fs.readFileSync('./config.ini', 'utf8')
const config = ini.parse(configFile)

withHermes((hermes, done) => {
    try {
        // Instantiate a dialog object
        const dialog = hermes.dialog()

        // Subscribes to intent 'Snips-RS-User:askDate'
        dialog.flow('intent/{{Snips-RS-User:askDate}}', async (message, flow) => {

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
