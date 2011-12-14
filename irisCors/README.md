Say you have a virgin CouchDB instance (still in "admin party"), something like (futon): "http://michiel.iriscouch.com/_utils/". Then pick a password, say "secret". You still need a cors proxy (we're trying to fix that). So then you have the following parameters:

    user address: "me@michiel.iriscouch.com"
    password: "secret"
    proxy: "http://yourremotestorage.net/CouchDB/proxy/"

Then what you need to run (in a terminal window on either a linux or a mac) is:

    node pimp.js me@michiel.iriscouch.com secret yourremotestorage.net/CouchDB/proxy/ | sh

Then go to http://myfavouritesandwich.org/ and log in with the user address you just created.
