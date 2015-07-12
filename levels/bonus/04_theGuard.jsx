#BEGIN_PROPERTIES#
{
    "version": "0.1",
    "commandsIntroduced": []
}
#END_PROPERTIES#
/******************
 *   theGuard.js  *
 * from HangoverX *
 * by janosgyerik *
 ******************
 *
 * Damn that was close!
 *
 * The next room feels strangely empty. And incredibly huge.
 * Whoever owns this place, they might be on to you now.
 * There's a guard drone near the exit and it's not looking friendly...
 */

function startLevel(map) {
#START_OF_START_LEVEL#
    map.displayChapter('Chapter 4\nThe Guard');

    var width = map.getWidth();
    var height = map.getHeight();
    var half_width = Math.floor(width / 2);
    var half_height = Math.floor(height / 2);

    map.placeObject(half_width, half_height, 'exit');
    map.placePlayer(width - 3, height - 3);
    map.placeObject(width - 1, height - 1, 'eye');
    map.placeObject(half_width + 2, half_height, 'guard');

#BEGIN_EDITABLE#

#END_EDITABLE#
#END_OF_START_LEVEL#
}

function validateLevel(map) {
    map.validateExactlyXManyObjects(1, 'exit');
}
