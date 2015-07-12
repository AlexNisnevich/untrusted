#BEGIN_PROPERTIES#
{
    "version": "1.2.1",
    "commandsIntroduced": ['object.pushable'],
    "music": "Brazil"
}
#END_PROPERTIES#
/********************
 * sampleLevel.js   *
 * by AlexNisnevich *
 ********************
 *
 */

function startLevel(map) {
#START_OF_START_LEVEL#
    map.placePlayer(0, 12);
    map.placeObject(map.getWidth()/2, map.getHeight()/2, 'exit');
#END_OF_START_LEVEL#
}
