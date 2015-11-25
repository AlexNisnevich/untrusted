#BEGIN_PROPERTIES#
{
    "version": "1.2.1",
    "commandsIntroduced": [],
    "music": "Brazil"
}
#END_PROPERTIES#


function startLevel(map) {
#START_OF_START_LEVEL#
  map.placePlayer(5,5);
#BEGIN_EDITABLE#

#END_EDITABLE#
  map.placeObject(15,15, 'computer');
#END_OF_START_LEVEL#
}