echo "Game.prototype._levels = {" > levels/levels.js

mod=$1

[ -z $mod ] && mod=levels

for lvl in $mod/*.jsx
do
	printf %s "    '$lvl': '" >> levels/levels.js
	echo "$lvl" | xargs sed "s#\\\#\\\\\\\#g" | sed "s#'#\\\'#g" | tr '\n' '`' | sed "s/\`/\\\n/g" | sed -e "a\\
	',
	" | tr '\n' ' ' >> levels/levels.js
	echo "" >> levels/levels.js # dummy newline for style
done
echo "};" >> levels/levels.js
