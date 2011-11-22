sudo node vhostRouter.js #port 80
node statics.js &        #port 8001 - statics
node remoteCouch.js &    #port 8002 - facade
node CORS.js &           #port 8003 - proxy
node userAddress.js &    #port 8004 - userAddress
