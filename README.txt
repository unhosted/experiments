This repo contains all the stuff we run at our rackspace demo server, hence the repo name.
But the interesting part is remoteCouch.js and CORS.js, because they allow you to use a CouchDB instance as your remote storage.

Here's how to do this:
- unless you already have a CouchDB instance, sign up for a freemium one at http://iriscouch.com
- go into your futon (http://<you>.iriscouch.com/_utils), create an admin user on the bottom right, and remember the usr/pwd
- register a domain name, and point it to a nodejs server
- on your nodejs server, npm install: forever (-g), http, https, http-proxy, proxy, cradle
- clone this repo
- copy config.sample.js to config.js and set your CouchDB address, and your usr/pwd
- forever start: vhostRouter.js, statics.js, CORS.js, remoteCouch.js
- go into your futon (http://<you>.iriscouch.com/_utils) and manually create a 'documents' database (FIXME)
- visit http://unhost.it/demo/text/ and log in as you@yourdomain.com
- if you have trouble getting this to work, please visit our chat room http://webchat.freenode.net/?channels=unhosted
