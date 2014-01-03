#BEGIN_PROPERTIES#
{
    "commandsIntroduced": 
        ["map.getDynamicObjects", "map.getRandomColor",
         "map.getCanvasContext", "map.getCanvasCoords",
         "object.setTarget"],
    "music": "Various_Artists_-_15_-_Slimeball_vomit"
}
#END_PROPERTIES#
/***************
 * pointers.js *
 ***************
 * 
 * You! How are you still alive?
 *
 * Well, no matter. Good luck getting through this
 * maze. You'll never see me or the Algorithm again!
 */

function startLevel(map) {
    // Randomly shuffles an array [http://bit.ly/1l6LGQT]
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
    
    // Ah look, Dr. Eval! It's your old friend,
    // the canvas.
    var canvas = map.getCanvasContext();

    var teleporters = map.getDynamicObjects();
    teleporters = shuffle(teleporters);

    for (i = 0; i < teleporters.length; i+=2) {
        var t1 = teleporters[i]; 
        var t2 = teleporters[i+1];

        // Make each pair of teleporters point to each other
        t1.setTarget(t2);
        t2.setTarget(t1);

#BEGIN_EDITABLE#
        // I could draw the path between the teleporters ...
        // but I'm going to draw useless circles instead. Ha!
        var startCoords = map.getCanvasCoords(t1);
        canvas.beginPath();
        canvas.arc(startCoords.x, startCoords.y, 3, 0, 2 * Math.PI);
        canvas.strokeStyle = map.getRandomColor(
            [150, 150, 150], [255, 255, 255]
        );
        canvas.stroke();


#END_EDITABLE#
    }
}

function validateLevel(map) {
    map.validateExactlyXManyObjects(1, 'exit');
}
