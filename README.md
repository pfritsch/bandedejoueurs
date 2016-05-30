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
* [bandedejoueurs.net](http://bandedejoueurs.net)


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

<!-- https://github.com/sachinbhutani/meteor-openshift

		cd bandedejoueurs
		meteor build tarball
		cp tarball/bandedejoueurs.tar.gz ../bdjapp
		rm tarball/bandedejoueurs.tar.gz
		cd ../bdjapp

		# for Mac or BSD-based
		tar -xvf bandedejoueurs.tar.gz -s '/^bundle//'

		# for Linux, or using GNU tar
		tar -xvf bandedejoueurs.tar.gz --transform 's|^bundle/||'

		rm bandedejoueurs.tar.gz
		git add --all
		git commit -a -m 'meteor-openshift'
		git push -->
