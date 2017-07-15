## Chop chop
Jus copy the chope code from the main campaign level 08 into the woods

for (var i = 0; i < map.getWidth(); i++) {
    for (var j = 0; j < map.getHeight(); j++) {
        if (map.getObjectTypeAt(i, j) === 'tree') {
            // remove existing forest
            map.placeObject(i,j, 'empty');
        }

        if (map.getPlayer().atLocation(i,j) ||
                map.getObjectTypeAt(i, j) === 'block' ||
                map.getObjectTypeAt(i, j) === 'exit') {
            continue;
        }
    }
}
