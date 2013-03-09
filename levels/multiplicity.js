// {"editable": [[23, 23]]}
/* multiplicity.js
 *
 * N.B. level filenames are hints!
 * I mean lots of games do that, why 
 * shouldn't this one?
 *
 * This level also looks exactly like the first
 * level, but with fewer lines of code that
 * you can edit. That is also a hint! Aren't
 * you happy that I am giving you hints? :)
 *
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
