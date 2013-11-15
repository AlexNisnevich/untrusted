#BEGIN_PROPERTIES#
{
    "music": "Rolemusic_-_07_-_Beach_Wedding_Dance",
    "mapProperties": {
        "keyDelay": 25
    }
}
#END_PROPERTIES#

/**********************
 * superDrEvalBros.js *
 **********************
 *
 *
 */

function startLevel(map) {

    var fl = Math.floor;
    var w = map.getWidth();
    var h = map.getHeight();

    map.placePlayer(1, fl(h/2)-1);

    map.placeObject(w-1, fl(h/2)-1, 'exit');

    for (var x = 0; x < fl(w/2) - 3; x++) {
        for (var y = fl(h/2); y < h; y++) {
            map.placeObject(x, y, 'block');
        }
    }

    for (var x = fl(w/2)+3; x <= w; x++) {
        for (var y = fl(h/2); y < h; y++) {
            map.placeObject(x, y, 'block');
        }
    }

    function gravity() {
        var player = map.getPlayer();
        var x = player.getX();
        var y = player.getY() + 1;

        if (y === map.getHeight() - 2) {
            player.killedBy("gravity");
        }

        if (map.getObjectTypeAt(x,y) === "empty") {
            player.move("down");
        }

    }
    map.startTimer(gravity, 50);

    function jump() {
        var player = map.getPlayer();
        var x = player.getX();
        var y = player.getY() + 1;

        if (map.getObjectTypeAt(x,y) !== "empty") {
            var framesLeft = 18;
            map.startTimer(function () {
                if (framesLeft > 0) {
                    map.getPlayer().move('up');
                    framesLeft--;
                }
            }, 25);
        }
    }
#BEGIN_EDITABLE#

#END_EDITABLE#
}

function validateLevel(map) {
    validateExactlyXManyObjects(map, 1, 'exit');
}
