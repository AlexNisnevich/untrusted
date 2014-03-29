#BEGIN_PROPERTIES#
{
    "version": "0.1",
    "activateSuperMenu": true,
    "music": "Comme Des Orages"
}
#END_PROPERTIES#

/*************
 * theEnd.js *
 *************
 *
 * If you're reading this, you must have defeated me and taken
 * the Algorithm. Unfortunately for you, you'll still never
 * be able to get out of this world.
 *
 *           All the best,
 *                 your friend
 */

function startLevel(map) {
    map.finalLevel = true;
    map.placePlayer(15, 12);
    map.placeObject(25, 12, 'exit');
#END_OF_START_LEVEL#
}
