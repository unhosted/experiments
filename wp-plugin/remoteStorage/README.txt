This plugin is experimental and not finished yet! But it sort of works already.
Install it, also install pfefferle's well-known, host-meta, and webfinger plugins, and activate them all.
Then go to Dashboard->settings->remoteStorage, and fill in something like (example assumes you're on Iris Couch, but it will also work with any other CouchDB provider or WebDAV provider or server):

    Template: http://yourremotestorage.net/CouchDB/proxy/EXAMPLE.iriscouch.com/{category}/ (replace 'EXAMPLE' with your own subdomain)
    Auth: http://EXAMPLE.iriscouch.com/cors/auth/modal.html (again, replace 'EXAMPLE')
    Api: CouchDB (case sensitive!)

When we have time we'll move the proxy that's now on yourremotestorage.net into this plugin, and also move our Couch Pimper into it. Reactions welcome!


Cheers,
Michiel.
