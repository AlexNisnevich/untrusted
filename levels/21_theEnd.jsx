#BEGIN_PROPERTIES#
{
    "activateSuperMenu": true
}
#END_PROPERTIES#

/*************
 * theEnd.js *
 *************/

function startLevel(map) {
    map.finalLevel = true;
    map.placePlayer(15, 12);
    map.placeObject(25, 12, 'exit');
#END_OF_START_LEVEL#
}
