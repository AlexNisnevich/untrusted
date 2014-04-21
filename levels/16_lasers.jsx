#BEGIN_PROPERTIES#
{
    "version": "1.2.3",
    "commandsIntroduced":
        ["map.getCanvasContext", "canvas.beginPath", "canvas.strokeStyle",
         "canvas.lineWidth", "canvas.moveTo", "canvas.lineTo",
         "canvas.stroke", "map.createLine", "map.validateAtLeastXLines"],
    "music": "Soixante-8",
    "mapProperties": {
        "showDrawingCanvas": true
    }
}
#END_PROPERTIES#
/*************
 * lasers.js *
 *************
 *
 * Time to unleash the killer lasers! Each laser will kill you
 * unless you have the appropriate color. Too bad you can't
 * see which color corresponds to which laser!
 */

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function startLevel(map) {
#START_OF_START_LEVEL#
    map.placePlayer(0, 0);
    map.placeObject(map.getWidth()-1, map.getHeight()-1, 'exit');
    var player = map.getPlayer();

    for (var i = 0; i < 25; i++) {
        var colors = ['red', 'yellow', 'teal'];

        var startX = getRandomInt(0, 600);
        var startY = getRandomInt(0, 500);
        var angle = getRandomInt(0, 360);
        var length = getRandomInt(200, 300);
        var color = colors[i % 3];
        createLaser(startX, startY, angle, length, color);
    }

    function createLaser(centerX, centerY, angleInDegrees, length, color) {
        var angleInRadians = angleInDegrees * Math.PI / 180;

        var x1 = centerX - Math.cos(angleInRadians) * length / 2;
        var y1 = centerY + Math.sin(angleInRadians) * length / 2;
        var x2 = centerX + Math.cos(angleInRadians) * length / 2;
        var y2 = centerY - Math.sin(angleInRadians) * length / 2;

        // map.createLine() creates a line with an effect when
        // the player moves over it, but doesn't display it
        map.createLine([x1, y1], [x2, y2], function (player) {
            if (player.getColor() != color) {
                player.killedBy('a ' + color + ' laser');
            }
        });

#BEGIN_EDITABLE#
        // using canvas to draw the line
        var ctx = map.getCanvasContext();
        ctx.beginPath();
        ctx.strokeStyle = 'white';
        ctx.lineWidth = 5;
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
#END_EDITABLE#

    }

#BEGIN_EDITABLE#









#END_EDITABLE#
#END_OF_START_LEVEL#
}

function validateLevel(map) {
    map.validateExactlyXManyObjects(1, 'exit');
    map.validateAtLeastXLines(25);
}
