#BEGIN_PROPERTIES#
{
}
#END_PROPERTIES#
/*****************
 * laserLevel.js *
 *****************
 *
 */

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function startLevel(map) {
#BEGIN_EDITABLE#
    map.placePlayer(0, 0);
    map.placeObject(map.getWidth()-1, map.getHeight()-1, 'exit');

    for (var i = 0; i < 20; i++) {
        // get random coordinates
        var x1 = getRandomInt(20, 580);
        var x2 = getRandomInt(20, 580);
        var y1 = getRandomInt(0, 500);
        var y2 = getRandomInt(0, 500);

        // map.createLine() creates a line with an effect when
        // the player moves over it, but doesn't display it
        map.createLine([x1, y1], [x2, y2], function (player) {
            player.killedBy('a laser');
        });

        // here we use canvas to draw the line
        var ctx = map.getCanvasContext();
        ctx.strokeStyle = "red";
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
    }
#END_EDITABLE#
#END_OF_START_LEVEL#
}

function validateLevel(map) {
    map.validateExactlyXManyObjects(1, 'exit');
}
