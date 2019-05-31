# Description


Skill for Snips : 
 - to announce the "date" or the "time" on demand.

Snips App : "Date et Heure" by Snips-RS-User.



# Generated Snips skill

This is a generated javascript snips skill using the `snips-template` tool.
It is compatible with the format expected by the `snips-skill-server`


## Setup

This skill requires some javascript dependencies to work properly, these are
listed in the `package.json` file. You can use the `setup.sh` script to install
them.


## Executables

This dir contains a number of javascript executables named `action-*.js`.
One such file is generated per intent supported. These are standalone
executables and will perform a connection to MQTT and register on the
given intent using the `mqtt` helper lib ($ npm install mqtt –save).



# Versionning

## 1.0.2 (and 1.0.1) (31/05/2019)
 - Update setup.sh : add command to do a executable file.

## 1.0.0 (13/05/2019)
 - New function : to announce the "date" or the "time".

