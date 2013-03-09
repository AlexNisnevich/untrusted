#!/bin/sh
LIST="
rot.js
text.js
scheduler.js
engine.js
js/array.js
js/date.js
js/number.js
js/string.js
js/object.js
js/function.js
display/display.js
display/backend.js
display/rect.js
display/hex.js
rng.js
stringgenerator.js
map/map.js
map/arena.js
map/dividedmaze.js
map/iceymaze.js
map/ellermaze.js
map/cellular.js
map/dungeon.js
map/digger.js
map/uniform.js
map/features.js
noise/noise.js
noise/simplex.js
fov/fov.js
fov/discrete-shadowcasting.js
fov/precise-shadowcasting.js
color.js
lighting.js
path/path.js
path/dijkstra.js
path/astar.js
"

TARGET=../rot.js
rm -f $TARGET

VERSION=$(head -1 < ../VERSION)

PROLOGUE="/*
	This is rot.js, the ROguelike Toolkit in JavaScript.
	Version $VERSION, generated on $(date).
*/
"
echo "$PROLOGUE" >> $TARGET

for FILE in $LIST; do
	cat $FILE >> $TARGET
done
