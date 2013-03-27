// {"editable": [[15, 23]]}

/*
 * blocks.js
 *
 * This is the first level, so we'll give you a hint.
 * In fact, a really obvious hint (hey, it's level 0).
 * The code currently places blocks in a rectangle
 * surrounding you. All you need to do is make a gap.
 * You don't even need to do anything extra. In fact,
 * you should be doing less...
 */
function startLevel(map) {
    map.placePlayer(7, 5);
#BEGIN_EDITABLE#

    for (y = 3; y <= map.getHeight() - 10; y++) {
        map.placeObject(5, y, 'block');
        map.placeObject(map.getWidth() - 5, y, 'block');
    }

    for (x = 5; x <= map.getWidth() - 5; x++) {
        map.placeObject(x, 3, 'block');
        map.placeObject(x, map.getHeight() - 10, 'block');
    }
#END_EDITABLE#

    if (!game.getCurrentPlayer().hasItem('computer')) {
        map.placeObject(15, 12, 'computer');
    }

    map.placeObject(map.getWidth()-7, map.getHeight()-5, 'exit');
}
