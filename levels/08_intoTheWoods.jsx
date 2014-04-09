#BEGIN_PROPERTIES#
{
    "version": "1.2",
    "commandsIntroduced":
        ["map.getObjectTypeAt", "player.getX", "player.getY",
         "map.refresh"],
    "mapProperties": {
        "allowOverwrite": true
    },
    "music": "Night Owl"
}
#END_PROPERTIES#
/*******************
 * intoTheWoods.js *
 *******************
 *
 * Ah, you're out of the woods now. Or into the woods, as the
 * case may be.
 *
 * So take a deep breath, relax, and remember what you're here
 * for in the first place.
 *
 * I've traced its signal and the Algorithm is nearby. You'll
 * need to go through the forest and across the river, and
 * you'll reach the fortress where it's kept. Their defences
 * are light, and we should be able to catch them off-guard.
 */

function startLevel(map) {
#START_OF_START_LEVEL#
    // NOTE: In this level alone, map.placeObject is allowed to
    //overwrite existing objects.

    map.displayChapter('Chapter 2\nRaiders of the Lost Algorithm');

    map.placePlayer(2, map.getHeight() - 1);

    var functionList = {};

    functionList['fortresses'] = function () {
        function genRandomValue(direction) {
            if (direction === "height") {
                return Math.floor(Math.random() * (map.getHeight()-3));
            } else if (direction === "width") {
                return Math.floor(Math.random() * (map.getWidth()+1));
            }
        }

        var x = genRandomValue("width");
        var y = genRandomValue("height");

        for (var i = x-2; i < x+2; i++) {
            map.placeObject(i,y-2, 'block');
        }
        for (var i = x-2; i < x+2; i++) {
            map.placeObject(i,y+2, 'block');
        }

        for (var j = y-2; j < y+2; j++) {
            map.placeObject(x-2,j, 'block');
        }

        for (var j = y-2; j < y+2; j++) {
            map.placeObject(x+2,j, 'block');
        }
    };

    functionList['generateForest'] = function () {
        for (var i = 0; i < map.getWidth(); i++) {
            for (var j = 0; j < map.getHeight(); j++) {

                // initialize to empty if the square contains a forest already
                if (map.getObjectTypeAt(i, j) === 'tree') {
                    // remove existing forest
                    map.placeObject(i,j, 'empty');
                }

                if (map.getPlayer().atLocation(i,j) ||
                        map.getObjectTypeAt(i, j) === 'block' ||
                        map.getObjectTypeAt(i, j) === 'exit') {
                    continue;
                }

                var rv = Math.random();
                if (rv < 0.45) {
                    map.placeObject(i, j, 'tree');
                }
            }
        }
        map.refresh();
    };

    functionList['movePlayerToExit'] = function () {
        map.writeStatus("Permission denied.");
    }

    functionList['pleaseMovePlayerToExit'] = function () {
        map.writeStatus("I don't think so.");
    }

    functionList['movePlayerToExitDamnit'] = function () {
        map.writeStatus("So, how 'bout them <LOCAL SPORTS TEAM>?");
    }

    // generate forest
    functionList['generateForest']();

    // generate fortresses
    functionList['fortresses']();
    functionList['fortresses']();
    functionList['fortresses']();
    functionList['fortresses']();

    map.getPlayer().setPhoneCallback(functionList[#{#"movePlayerToExit"#}#]);

    map.placeObject(map.getWidth()-1, map.getHeight()-1, 'exit');
#END_OF_START_LEVEL#
}

function validateLevel(map) {
    map.validateAtLeastXObjects(100, 'tree');
    map.validateExactlyXManyObjects(1, 'exit');
}
