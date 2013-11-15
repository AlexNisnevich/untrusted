#BEGIN_PROPERTIES#
{
    "commandsIntroduced":
        ["map.getObjectTypeAt", "player.getX", "player.getY",
         "output.write"],
    "mapProperties": {
        "allowOverwrite": true
    }
}
#END_PROPERTIES#
/*******************
 * intoTheWoods.js *
 *******************
 *
 * Ah, you're out of the woods now. Or into the woods, as the
 * case may be. Your function phone may serve you well here.
 *
 */

function startLevel(map) {
    // NOTE: In this level alone, map.placeObject is allowed to
    //overwrite existing objects.


    map.placePlayer(2, map.getHeight() - 1);

    var functionList = {};

    functionList['fortresses'] = function () {
        function genRandomValue(direction) {
            if (direction === "height") {
                return Math.floor(Math.random() * (map.getHeight() +1));
            } else if (direction === "width") {
                return Math.floor(Math.random() * (map.getWidth() +1));
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
            map.placeObject(i-2,j, 'block');
        }

        for (var j = y-2; j < y+2; j++) {
            map.placeObject(i+2,j, 'block');
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
                        map.getObjectTypeAt(i, j) === 'exit') {
                    continue;
                }

                var rv = Math.random();
                if (rv < 0.45) {
                    map.placeObject(i, j, 'tree');
                }
            }
        }
        display.drawAll(map);
    };

    functionList['movePlayerToExit'] = function () {
        output.write("Permission denied.");
    }

    functionList['pleaseMovePlayerToExit'] = function () {
        output.write("I don't think so.");
    }

    functionList['movePlayerToExitDamnit'] = function () {
        output.write("So, how 'bout them <LOCAL SPORTS TEAM>?");
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
}

function validateLevel(map) {
    validateAtLeastXObjects(map, 100, 'tree');
    validateExactlyXManyObjects(map, 1, 'exit');
}
