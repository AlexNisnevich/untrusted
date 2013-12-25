# Partially based off of:
# http://nefariousdesigns.co.uk/website-builds-using-make.html

js-target = scripts/build/untrusted.js
js-target-min = scripts/build/untrusted.min.js

js-modules = scripts/util.js \
             scripts/game.js \
             scripts/codeEditor.js \
             scripts/display.js \
             scripts/dynamicObject.js \
             scripts/inventory.js \
             scripts/map.js \
             scripts/objects.js \
             scripts/player.js \
             scripts/reference.js \
             scripts/sound.js \
             scripts/validate.js \
             scripts/ui.js \
             scripts/launcher.js

js-modules-debug = scripts/util.js \
	               scripts/game.js \
	               scripts/codeEditor.js \
	               scripts/display.js \
	               scripts/dynamicObject.js \
	               scripts/inventory.js \
	               scripts/map.js \
	               scripts/objects.js \
	               scripts/player.js \
	               scripts/reference.js \
	               scripts/sound.js \
	               scripts/validate.js \
	               scripts/ui.js \
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
	@cp -R levels scripts styles images sound index.html _site
	@./deploy.sh _site
	@rm -rf _site
	@echo "[ Done ]"

# `make deploy-full` also deploys music and libs
deploy-full: release
	@echo "Deploying to server…\t\t\t\c"
	@rm -rf _site
	@mkdir _site
	@cp -R levels scripts styles images sound music lib index.html _site
	@./deploy.sh _site
	@rm -rf _site
	@echo "[ Done ]"


# run-local will start a mini python webserver and host a local
# instance of the game on port 9001

runlocal: debug
	@echo "Running local instance"
	~/node_modules/http-server/bin/http-server
