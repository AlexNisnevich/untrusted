#BEGIN_PROPERTIES#
{

}
#END_PROPERTIES#
/**********************
 * domManipulation.js *
 **********************
 *
 *
 */

function startLevel(map) {
    map.placePlayer(1, 1);
    map.placeObject(map.getWidth()-7, map.getHeight()-5, 'exit');

    map.createFromDOM("<div style='width: 100px; height: 100px; background-color: red'></div>");
#END_OF_START_LEVEL#
}