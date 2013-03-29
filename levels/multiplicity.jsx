/*
 * multiplicity.js
 *
 * N.B. level filenames can be hints!
 * I mean, lots of games do that, why
 * shouldn't this one?
 *
 * This level also looks an awful lot like the first
 * couple, but with fewer lines of code that
 * you can edit. That is also a hint! Aren't
 * you happy that I am giving you hints? :)
 */

function startLevel(map) {

    map.placePlayer(map.getWidth()-5, map.getHeight()-4);

    for (y = 7; y <= map.getHeight() - 3; y++) {
        map.placeObject(7, y, 'block');
        map.placeObject(map.getWidth() - 3, y, 'block');
    }
#BEGIN_EDITABLE#

#END_EDITABLE#
    for (x = 7; x <= map.getWidth() - 3; x++) {
        map.placeObject(x, 7, 'block');
        map.placeObject(x, map.getHeight() - 3, 'block');
    }

    map.placeObject(map.getWidth() - 5, 5, 'exit');
}
