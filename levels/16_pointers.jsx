#BEGIN_PROPERTIES#
{

}
#END_PROPERTIES#

/***************
 * pointers.js *
 ***************
 *
 */

function startLevel(map) {
    //+ Jonas Raoni Soares Silva
    //@ http://jsfromhell.com/array/shuffle [v1.0]
    function shuffle(o){ //v1.0
        for(var j, x, i = o.length; i; j = Math.floor(Math.random() * i),
            x = o[--i], o[i] = o[j], o[j] = x);
        return o;
    };

    map.placePlayer(5, 5);
    map.placeObject(35, 21, 'exit');

    for (x = 4; x <= 36; x++) {
        map.placeObject(x, 4, 'block');
        map.placeObject(x, 22, 'block');
    }

    for (y = 5; y <= 21; y++) {
        map.placeObject(4, y, 'block');
        map.placeObject(36, y, 'block');
    }

    for (x = 6; x <= 34; x += 2) {
        for (y = 6; y <= 20; y += 2) {
            map.placeObject(x, y, 'block');
        }
    }

    for (x = 5; x <= 35; x += 2) {
        for (y = 5; y <= 21; y += 2) {
            if (!((x == 5 && y == 5) || (x == 35 && y == 21))) {
                map.placeObject(x, y, 'teleporter');
            }
        }
    }

    var canvas = map.getCanvasContext();
    var exitCoords = map.getCanvasCoords(35, 21);
    canvas.beginPath();
    canvas.arc(exitCoords.x, exitCoords.y, 20, 0, 2*Math.PI);
    canvas.strokeStyle = "red";
    canvas.stroke();

    var teleporters = map.getDynamicObjects();
    teleporters = shuffle(teleporters);

    for (i = 0; i < teleporters.length; i+=2) {
#BEGIN_EDITABLE#







#END_EDITABLE#

        teleporters[i].target = teleporters[i+1];
        teleporters[i+1].target = teleporters[i];
    }

}
