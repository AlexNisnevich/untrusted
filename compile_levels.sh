echo "Game.prototype._levels = {" > levels/levels.js

mod=$1

for lvl in mods/$mod/*.jsx
do
	lvlfn=`basename $lvl`
	printf %s "    'levels/$lvlfn': '" >> levels/levels.js
	echo "$lvl" | xargs sed "s#\\\#\\\\\\\#g" | sed "s#'#\\\'#g" | tr '\n' '`' | sed "s/\`/\\\n/g" | sed -e "a\\
	',
	" | tr '\n' ' ' >> levels/levels.js
	echo "" >> levels/levels.js # dummy newline for style
done
echo "};" >> levels/levels.js
