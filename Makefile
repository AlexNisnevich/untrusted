# Source: http://nefariousdesigns.co.uk/website-builds-using-make.html

js-page-target = scripts/build/untrusted.js

js-page-prereq = scripts/game.js \
                 scripts/map.js \
                 scripts/objects.js \
                 scripts/player.js \
                 scripts/validate.js

yui-jar = tools/yuicompressor-2.4.8pre.jar

$(js-page-target): $(js-page-prereq)
	@rm -f $(js-page-target)
	@echo "Merging JS files…\t\t\t\c"
	@cat $(js-page-prereq) > scripts/build/tmp.js
	@echo "[ Done ]"
	@echo "Compressing merged JS…\t\c"
	@java -jar $(yui-jar) -o $(js-page-target) scripts/build/tmp.js
	@echo "[ Done ]"
	@rm -f scripts/build/tmp.js
