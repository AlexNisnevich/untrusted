# Partially based off of:
# http://nefariousdesigns.co.uk/website-builds-using-make.html

js-target = scripts/build/untrusted.js
js-target-min = scripts/build/untrusted.min.js

js-modules = scripts/game.js \
                 scripts/display.js \
                 scripts/codeEditor.js \
                 scripts/map.js \
                 scripts/objects.js \
                 scripts/player.js \
                 scripts/validate.js

yui-jar = tools/yuicompressor-2.4.8pre.jar

# `make` merges and compresses scripts
$(js-target-min): $(js-modules)
	@rm -f $(js-target-min)
	@echo "Merging JS files…\t\t\t\c"
	@cat $(js-modules) > $(js-target)
	@echo "[ Done ]"
	@echo "Compressing merged JS…\t\t\t\c"
	@java -jar $(yui-jar) -o $(js-target-min) $(js-target)
	@echo "[ Done ]"

# to use `make deploy` to deploy Untrusted to your own server, create
# a deploy.sh script (ncftpput is helpful for uploading via FTP).
deploy: $(js-target-min)
	@echo "Deploying to server…\t\t\t\c"
	@rm -rf _site
	@mkdir _site
	@cp -R levels scripts styles index.html _site
	@./deploy.sh _site
	@rm -rf _site
	@echo "[ Done ]"

# `make deploy-full` also deploys libs
deploy-full: $(js-target-min)
	@echo "Deploying to server…\t\t\t\c"
	@rm -rf _site
	@mkdir _site
	@cp -R levels scripts styles lib index.html _site
	@./deploy.sh _site
	@rm -rf _site
	@echo "[ Done ]"
