This tool will pimp your virgin CouchDB instance, making it (almost) compatible with [remoteStorage](http://www.w3.org/community/unhosted/wiki/RemoteStorage). If you don't have a CouchDB instance, you can get one for free at [Iris Couch](http://iriscouch.com), or set one up on your [localhost](http://localhost/).

Say you have a virgin CouchDB instance (still in "admin party"), something like (futon): "http://michiel.iriscouch.com/_utils/". Then pick a password, say "secret". You still need a cors proxy (we're trying to fix that). So then you have the following parameters:

    user address: "michiel@michiel.iriscouch.com"
    password: "secret"
    proxy: "http://yourremotestorage.net/CouchDB/proxy/"

Then what you need to run (in a terminal window on either a linux or a mac) is:

    node pimp.js michiel@michiel.iriscouch.com secret yourremotestorage.net/CouchDB/proxy/ | sh

Then go to http://myfavouritesandwich.org/ and log in with the user address you just created.
