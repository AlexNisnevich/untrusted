#BEGIN_PROPERTIES#
{
    "version": "1.2",
    "commandsIntroduced": [],
    "music": "The_Waves_Call_Her_Name",
    "startingMessage": "You have lost the Algorithm!"
}
#END_PROPERTIES#
/**************************
 * exceptionalCrossing.js *
 **************************
 *
 * Sorry, old friend, but I'm afraid I can't share
 * co-authorship on this paper. You've done a very
 * good job getting this Algorithm for me. The bit
 * with the keys was especially clever! I wouldn't
 * have thought of it myself. But then, of course,
 * that's why you were here in the first place.
 *
 * You've served your purpose well. But now, alas,
 * it is time for you to die.
 *
 * I'm not heartless, though. In fact, I will let
 * you choose your mode of death. There, isn't that
 * nice?
 */

function startLevel(map) {
#START_OF_START_LEVEL#
    map.displayChapter('Chapter 3\nBetrayal');

    map.placePlayer(0, 0);

    // yoink!
    map.getPlayer().removeItem('theAlgorithm');

    map.defineObject('water', {
        'symbol': '░',
        'color': '#44f',
        'onCollision': function (player) {
            player.killedBy#{#('drowning in deep dark water')#}#;
        }
    });

    for (var x = 0; x < map.getWidth(); x++)
        for (var y = 5; y < 15; y++)
            map.placeObject(x, y, 'water');

    map.placeObject(map.getWidth()-1, map.getHeight()-1, 'exit');
#END_OF_START_LEVEL#
}

function validateLevel(map) {
    map.validateExactlyXManyObjects(1, 'exit');
}
