#BEGIN_PROPERTIES#
{
    "commandsIntroduced":
        ["map.getGrid", "player.getX", "player.getY",
         "player.setPhoneCallback", "output.write"],
    "mapProperties": {
        "allowOverwrite": true
    }
}
#END_PROPERTIES#
/*
 * trees.js - the obligatory forest level
 *
 * Dr. Eval was in a pickle. He needed to move through the shifting
 * forest without resetting his own position every time the forest
 * changed. Fortunately, he had another tool at his disposal ...
 *
 * NOTE: In this level, map.placeObject is allowed to overwrite existing objects.
 */
function startLevel(map) {
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
                if (map.getGrid()[i][j].type === 'tree') {
                    // remove existing forest
                    map.placeObject(i,j, 'empty');
                }

                if (map.getPlayer().atLocation(i,j) ||
                        map.getGrid()[i][j].type === 'exit') {
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

    functionList['placePhone'] = function () {
        map.placeObject(map.getPlayer().getX() + 1,
                        map.getPlayer().getY(), 'phone');
    }

    functionList['movePlayerToExit'] = function () {
        output.write("So, how 'bout them <LOCAL SPORTS TEAM>?");
    }

    functionList['movePlayerToExitForRealz'] = function () {
        output.write("Did you know that penguins have nuclear weapons? I sure didn't!");
    }

    functionList['movePlayerToExitDamnit'] = function () {
        output.write("lol no I'm not moving you to the exit, player! Suck it!");
    }

    // generate forest
    functionList['generateForest']();

    // generate fortresses
    functionList['fortresses']();
    functionList['fortresses']();
    functionList['fortresses']();
    functionList['fortresses']();

    // so you can call functions
    if (!map.getPlayer().hasItem('phone')) {
        functionList['placePhone']();
    }

    map.getPlayer().setPhoneCallback(functionList[#{#"movePlayerToExit"#}#]);

    map.placeObject(map.getWidth()-1, map.getHeight()-1, 'exit');
}

function validateLevel(map) {
    validateAtLeastXObjects(map, 100, 'tree');
    validateExactlyXManyObjects(map, 1, 'exit');
}
