# Partially based off of:
# http://nefariousdesigns.co.uk/website-builds-using-make.html

js-target = scripts/build/untrusted.js
js-target-min = scripts/build/untrusted.min.js

js-modules = scripts/game.js \
                 scripts/display.js \
                 scripts/codeEditor.js \
                 scripts/map.js \
                 scripts/dynamicObject.js \
                 scripts/objects.js \
                 scripts/player.js \
                 scripts/reference.js \
                 scripts/validate.js \
                 scripts/launcher.js

js-modules-debug = scripts/game.js \
                 scripts/display.js \
                 scripts/codeEditor.js \
                 scripts/map.js \
                 scripts/dynamicObject.js \
                 scripts/objects.js \
                 scripts/player.js \
                 scripts/reference.js \
                 scripts/validate.js \
                 scripts/launcher-debug.js

yui-jar = tools/yuicompressor-2.4.8pre.jar

# `make` or `make debug` merges scripts (using debug launcher)
debug: $(js-modules-debug)
	@echo "Merging JS files…\t\t\t\c"
	@cat $(js-modules-debug) > $(js-target)
	@echo "[ Done ]"

# `make release` merges and compresses scripts (using release launcher)
release: $(js-modules)
	@rm -f $(js-target-min)
	@echo "Merging JS files…\t\t\t\c"
	@cat $(js-modules) > $(js-target)
	@echo "[ Done ]"
	@echo "Compressing merged JS…\t\t\t\c"
	@java -jar $(yui-jar) -o $(js-target-min) $(js-target)
	@echo "[ Done ]"

# `make clean` removes built scripts
clean:
	@rm -f $(js-target) $(js-target-min)

# to use `make deploy` to deploy Untrusted to your own server, create
# a deploy.sh script (ncftpput is helpful for uploading via FTP).
deploy: release
	@echo "Deploying to server…\t\t\t\c"
	@rm -rf _site
	@mkdir _site
	@cp -R levels scripts styles index.html _site
	@./deploy.sh _site
	@rm -rf _site
	@echo "[ Done ]"

# `make deploy-full` also deploys libs
deploy-full: release
	@echo "Deploying to server…\t\t\t\c"
	@rm -rf _site
	@mkdir _site
	@cp -R levels scripts styles lib index.html _site
	@./deploy.sh _site
	@rm -rf _site
	@echo "[ Done ]"


# run-local will start a mini python webserver and host a local
# instance of the game on port 9001

runlocal:
	@echo "Running local instance"
	/usr/bin/env python2 -m SimpleHTTPServer 9001
