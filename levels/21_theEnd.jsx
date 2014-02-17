#BEGIN_PROPERTIES#
{

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

// TODO: implement UI for loading script files
// for now, run the following in console (debug mode only):
//      > game._editFile('scripts/objects.js')
