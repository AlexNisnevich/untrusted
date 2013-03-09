// {"editable": [[14, 23]]}

/*
 * This is the first level, so we'll give you a hint.
 * In fact, a really obvious hint (hey it's level 0).
 * The code currently places blocks in a square surrounding
 * you. All you need to do is make a gap.
 * You don't even need to do anything extra. In fact,
 * you should be doing less...
 */
function startLevel(map) {

    map.player = new Player(15, 15);

    for (y = 5; y <= dimensions.height - 5; y++) {
        map.placeObject(5, y, 'block');
        map.placeObject(dimensions.width - 5, y, 'block');
    }

    for (x = 5; x <= dimensions.width - 5; x++) {
        map.placeObject(x, 5, 'block');
        map.placeObject(x, dimensions.height - 5, 'block');
    }

    map.placeObject(dimensions.width-1, dimensions.height-1, 'exit');
}
