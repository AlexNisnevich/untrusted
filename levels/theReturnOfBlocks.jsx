#BEGIN_PROPERTIES#
{
    "commandsIntroduced":
        ["global.validateLevel", "game.validateAtLeastXObjects",
         "game.validateExactlyXManyObjects"]
}
#END_PROPERTIES#
/*
 * theReturnOfBlocks.js
 *
 * Of course, you mustn't think that we'd let you
 * get away with just anything! The validateLevel
 * function enforces constraints on what you can do.
 * In this case, you're not allowed to remove any
 * blocks.
 */
function startLevel(map) {
    map.placePlayer(map.getWidth()-7, map.getHeight()-5);
#BEGIN_EDITABLE#

    for (y = 10; y <= map.getHeight() - 3; y++) {
        map.placeObject(5, y, 'block');
        map.placeObject(map.getWidth() - 5, y, 'block');
    }

    for (x = 5; x <= map.getWidth() - 5; x++) {
        map.placeObject(x, 10, 'block');
        map.placeObject(x, map.getHeight() - 3, 'block');
    }
#END_EDITABLE#

    map.placeObject(7, 5, 'exit');
}

function validateLevel(map) {
    numBlocks = 2 * (map.getHeight()-13) + 2 * (map.getWidth()-10);

    validateAtLeastXObjects(map, numBlocks, 'block');
    validateExactlyXManyObjects(map, 1, 'exit');
}
