// {"editable": [[93,93]]}

/*
 * trees.js - the obligatory forest level
 *
 * the way this level works is that the player has to find a phone
 * so they can call functions, then in code bind that callback to the
 * function to clear trees *without* resetting player position
 */
function startLevel(map) {

    map.player = new Player(2, map.getHeight() - 1);

    var functionList = {};
    functionList['fortresses'] = function  () {

        function genRandomValue(direction) {
            if (direction === "height") {
                return Math.floor(Math.random() * (map.getHeight() +1));
            }
            else if (direction === "width") {
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

                //initialize to empty if the square contains a forest already
                if (map._grid[i][j] === 'tree') {
                    console.log("Removing existing forest");
                    map.placeObject(i,j,'empty');
                }

                if (map.player.atLocation(i,j) || map._grid[i][j] === 'exit') {
                    continue;
                }
                var rv = Math.random();
                if (rv < 0.45) {
                    map.placeObject(i, j, 'tree');
                }
            }
        }
    };

    functionList['placePhone'] = function() {
        map.placeObject(map.player._x + 1, map.player._y, 'phone');
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

    //generate forest
    functionList['generateForest']();

    //generate fortresses
    functionList['fortresses']();
    functionList['fortresses']();
    functionList['fortresses']();
    functionList['fortresses']();

    // so you can call functions
    functionList['placePhone']();

    map.player.setPhoneCallback(functionList["movePlayerToExit"])

    map.placeObject(map.getWidth()-1, map.getHeight()-1, 'exit');
}

function validateLevel(map) {

}
