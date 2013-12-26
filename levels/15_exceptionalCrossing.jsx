#BEGIN_PROPERTIES#
{
    "commandsIntroduced": [],
    "music": "Sycamore_Drive_-_03_-_The_Waves_Call_Her_Name"
}
#END_PROPERTIES#
/**************************
 * exceptionalCrossing.js *
 **************************
 *
 * [Insert betrayal here]
 */

function startLevel(map) {
    map.displayChapter('Chapter 3\nBetrayal');

    map.placePlayer(map.getWidth()-1, map.getHeight()-1);

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

    map.placeObject(0, 0, 'exit');
}

function validateLevel(map, validators) {
    validators.validateExactlyXManyObjects(map, 1, 'exit');
}
