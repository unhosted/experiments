forever stopall
mv /root/.forever/*.log /root/.forever-old/
forever start vhostRouter.js #port 80
forever start statics.js        #port 8001 - statics
forever start remoteCouch.js    #port 8002 - facade
forever start CORS.js           #port 8003 - proxy
forever start userAddress.js    #port 8004 - userAddress
forever list
tail -f /root/.forever/*.log
