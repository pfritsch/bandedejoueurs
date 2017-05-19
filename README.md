Bande de Joueurs
==============

What?
---

"Bande de Joueurs", is an open community, where gamers can meet new mates, take contact and play together.

Why
---

Because we believe that gaming shouldn't isolate players, but let people getting closer and share fun time.

How?
---

1. Organize or take part to a game session, with the games you like
2. Meet other players as agrees, online or near you.
3. That's all. The party can begin!

Where?
---

* [bandedejoueurs.com](http://bandedejoueurs.com),
* [bandedejoueurs.fr](http://bandedejoueurs.fr)


Dev Setup
==============

Meteor
---

1. Install Meteor.js:

		curl https://install.meteor.com/ | sh

2. Run Meteor:

		meteor run --settings settings.json


Documentation
===============

* CSS Structure: [SMACSS](https://smacss.com/)
* Grid: [Susy](http://susy.oddbird.net/)
* Framework: [Foundation](http://foundation.zurb.com/sites/docs/)


Deployment
==============

		mupx setup
		mupx deploy


__Doesn't yet work with npm v6+ (have to select npm 5.11.1 on nvm)__

	. ~/.nvm/nvm.sh
	nvm use


Clean Docker
==============

https://lebkowski.name/docker-volumes/

		ssh ubuntu@159.100.249.37
		sudo su -

		# to check
		docker images

		# remove exited containers:
		docker ps --filter status=dead --filter status=exited -aq | xargs -r docker rm -v

		# remove unused images:
		docker images --no-trunc | grep '<none>' | awk '{ print $3 }' | xargs -r docker rmi
