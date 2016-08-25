# Partially based off of:
# http://nefariousdesigns.co.uk/website-builds-using-make.html

# if a mod is specified but doesn't exist, raise an error
err:=$(shell if [ ! -z '$(mod)' ] && [ ! -d 'mods/$(mod)' ]; then echo 'Mod [$(mod)] not found!'; fi)
ifneq '$(err)' ''
$(error $(err))
endif

mod-dir=$(shell if [ -z '$(mod)' ]; then echo 'default'; else echo $(mod); fi)

err:=$(shell if [ ! -f 'mods/$(mod-dir)/intro.js' ]; then echo 'File mods/$(mod-dir)/intro.js not found!'; fi)
ifneq '$(err)' ''
$(error $(err))
endif

js-target = scripts/build/untrusted.js
js-target-min = scripts/build/untrusted.min.js

js-modules = scripts/util.js \
			 mods/$(mod-dir)/intro.js\
			 scripts/_head.js \
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
			 levels/levels.js \
			 scripts/_launcher_release.js \
			 scripts/_tail.js

js-modules-debug = scripts/util.js \
				   mods/$(mod-dir)/intro.js\
				   scripts/_head.js \
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
				   levels/levels.js \
				   scripts/_launcher_debug.js \
				   scripts/_tail.js

yui-jar = tools/yuicompressor-2.4.8pre.jar

# `make` or `make debug` merges scripts (using debug launcher)
debug:
	@echo "Building level file…\t\t\t\c"
	@./compile_levels.sh $(mod-dir)
	@echo "[ Done ]"
	@echo "Merging JS files…\t\t\t\c"
	@cat $(js-modules-debug) > $(js-target)
	@./parse_target.sh $(js-target) $(mod-dir)
	@echo "[ Done ]"

# `make release` merges and compresses scripts (using release launcher)
release:
	@rm -f $(js-target-min)
	@echo "Building level file…\t\t\t\c"
	@./compile_levels.sh $(mod-dir)
	@echo "[ Done ]"
	@echo "Merging JS files…\t\t\t\c"
	@cat $(js-modules) > $(js-target)
	@./parse_target.sh $(js-target) $(mod-dir)
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
	@./deploy.sh /untrusted _site
	@rm -rf _site
	@echo "[ Done ]"

# `make deploy-full` also deploys music and libs
deploy-full: release
	@echo "Deploying to server…\t\t\t\c"
	@rm -rf _site
	@mkdir _site
	@cp -R levels scripts styles images sound music lib index.html _site
	@./deploy.sh /untrusted _site
	@rm -rf _site
	@echo "[ Done ]"

# `make deploy-debug` deploys the debug version to /debug
deploy-debug: debug
	@echo "Deploying to server…\t\t\t\c"
	@rm -rf _site
	@mkdir _site
	@cp -R levels scripts styles images sound index.html _site
	@./deploy.sh /untrusted/debug _site
	@rm -rf _site
	@echo "[ Done ]"

# `make deploy-debug` deploys the debug version to /debug
deploy-debug-full: debug
	@echo "Deploying to server…\t\t\t\c"
	@rm -rf _site
	@mkdir _site
	@cp -R levels scripts styles images sound music lib index.html _site
	@./deploy.sh /untrusted/debug _site
	@rm -rf _site
	@echo "[ Done ]"

deploy-github:
	@git checkout gh-pages && git merge master --no-commit && make release && git commit -am "build" && git push origin gh-pages; git checkout master && make

# run-local will start a mini python webserver and host a local
# instance of the game will run on an available port
# the option -c-1 disables caching
runlocal: debug
	@echo "Running local instance"
	./node_modules/http-server/bin/http-server -c-1
