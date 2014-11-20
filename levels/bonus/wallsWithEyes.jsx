#BEGIN_PROPERTIES#
{
    "version": "1.2.1",
    "commandsIntroduced": ['object.pushable'],
    "music": "Brazil"
}
#END_PROPERTIES#
/********************
 * wallsWithEyes  *
 * by group19 *
 ********************
 * Good Evening Dr and welcome to the Temple of Doom
 * Do you see your priceless item on that shrine at the end
 * Now do you see that skeleton right underneath
 * Ya...that was Indiana Jones
 * Good luck picking up the item...just remember the walls have eyes...
 * ...If Indiana Jones couldn't get there, what makes you think you will...
 */
 

function startLevel(map) {
#START_OF_START_LEVEL#
    map.placePlayer(map.getWidth()/2, 1);
    map.placeObject(map.getWidth()/2, map.getHeight()-1, 'exit');
#END_OF_START_LEVEL#
}
