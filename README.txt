This is our experiments repo. It's in a continuous state of experimentation.

Draft instructions for "how to get started with this whole unhosted thing", written for prospective libredocs.org users:

Libredocs.org is a special website in that it does not offer hosted account, only unhosted accounts. This means that we at libredocs don't store your documents on our servers! Good for your freedom and privacy; and it also saves us a lot of money... :)

To use libredocs with an unhosted account, you will need cloud storage somewhere. Most of us use iriscouch for this, it's easy, cheap and good, and it's run by a bunch of awesome people. So unless you have or want to get cloud storage
for your user data somewhere else, we recommend you sign up for a free iriscouch account as follows:
- Go to http://www.iriscouch.com/service - on the right there is a form to create your account
- Wait until it says 'Hooray, your CouchDB instance is now ready at: http://YOURNAME.iriscouch.com/_utils/'
- Click on the link to see your storage. This may look complicated, but it's a place you would normally not go to every day
- On the bottom right, you will see "Welcome to Admin Party! Everyone is admin. <Fix this>". Click 'Fix this'.
- IMPORTANT: This is the step where you need to pay special attention: Choose the /same/ username as before again, so if you are on http://YOURNAME.iriscouch.com/_utils/ pick "YOURNAME" as the username for the admin account), and pick a password.
- that's it! now you can use YOURNAME@iriscouch.com on http://libredocs.org/ (more places coming soon).


This repo contains all the stuff we run in our experiments, you normally wouldn't have to use this, but in case you do, have a look at start.sh - it runs a vhostRouter, with several different experiments behind it (all on 50.56.81.234)

If you have trouble getting this to work, please visit our chat room http://webchat.freenode.net/?channels=unhosted
