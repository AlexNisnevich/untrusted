#BEGIN_PROPERTIES#
{

}
#END_PROPERTIES#
/****************************
 * documentObjectMadness.js *
 ****************************
 *
 * I can't believe it! I can't believe you made it onto Department of
 * Theoretical Computation's web server!  YOU SHOULD HAVE BEEN DELETED! This
 * shouldn't even be possible! What the hell were the IT folks thinking?
 *
 * No matter. I still have the Algorithm. That's the important part. The rest
 * is just implementation, and how hard could that be?
 *
 * Anyway you're not going to make it out of this one, my good Doctor. After
 * all, you're a tenured professor with a well-respected history of research -
 * you probably don't know jQuery!
 *
 */

function objective(map) {
    return map.getDOM().find('.adversary').hasClass('drEval');
}

function startLevel(map) {
    var html = "<div class='offLimits'>" +
    "<div style='width: 600px; height: 500px; background-color: white; font-size: 10px;'>" +
        "<center><h1>Department of Theoretical Computation</h1></center>" +
        "<hr />" +
        "<table border='0'><tr valign='top'>" +
            "<td><div id='face' /></td>" +
            "<td>" +
                "<h2>Cornelius Eval</h2>" +
                "<h3>Professor</h3>" +
                "Fields of study:" +
                "<ul>" +
                    "<li>Human-computer interface</li>" +
                    "<li>NP completeness</li>" +
                "</ul>" +
            "</td>" +
        "</tr></table>" +
        "<hr />" +
    "</div></div>";

    var $dom = $(html);

    $dom.find('ul').addClass('drEval');
    $dom.find('h2').addClass('adversary');

    function moveToParent(className) {
        var currentPosition = $dom.find('.' + className);
        if (currentPosition.parent().length > 0 &&
                !currentPosition.parent().hasClass('offLimits')) {
            currentPosition.parent().addClass(className);
            currentPosition.removeClass(className);
            map.updateDOM($dom);
        }
    }

    function moveToFirstChild(className) {
        var currentPosition = $dom.find('.' + className);
        if (currentPosition.children().length > 0) {
            currentPosition.children().first().addClass(className);
            currentPosition.removeClass(className);
            map.updateDOM($dom);
        }
    }

    function moveToPreviousSibling(className) {
        var currentPosition = $dom.find('.' + className);
        if (currentPosition.prev().length > 0) {
            currentPosition.prev().first().addClass(className);
            currentPosition.removeClass(className);
            map.updateDOM($dom);
        }
    }

    function moveToNextSibling(className) {
        var currentPosition = $dom.find('.' + className);
        if (currentPosition.next().length > 0) {
            currentPosition.next().first().addClass(className);
            currentPosition.removeClass(className);
            map.updateDOM($dom);
        }
    }

    map.overrideKey('up', function () { moveToParent('drEval'); });
    map.overrideKey('down', function () { moveToFirstChild('drEval'); });
    map.overrideKey('left', function () { moveToPreviousSibling('drEval'); });
    map.overrideKey('right', function () { moveToNextSibling('drEval'); });

    map.defineObject('adversary', {
        'type': 'dynamic',
        'symbol': '@',
        'color': 'red',
        'behavior': function (me) {
            var move = Math.floor(Math.random() * 4) + 1; // 1, 2, 3, or 4
            if (move == 1) {
                moveToParent('adversary');
            } else if (move == 2) {
                moveToFirstChild('adversary');
            } else if (move == 3) {
                moveToPreviousSibling('adversary');
            } else if (move == 4) {
                moveToNextSibling('adversary');
            }
        }
    });

    map.placePlayer(1, 1);
    map.placeObject(map.getWidth() - 2, map.getHeight() - 2, 'adversary');

    map.createFromDOM($dom);
#END_OF_START_LEVEL#
}
