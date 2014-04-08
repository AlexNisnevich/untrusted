echo "Game.prototype._levels = {" > levels/levels.js
for lvl in levels/*.jsx 
do
	echo -n "\t'$lvl': '" >> levels/levels.js
	echo "$lvl" | xargs sed "s#\\\#\\\\\\\#g" | sed "s#'#\\\'#g" | tr '\n' '`' | sed "s/\`/\\\n/g" | sed -e "a'," | tr -t '\n' ' ' >> levels/levels.js
done
echo "}" >> levels/levels.js 