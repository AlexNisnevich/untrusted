#BEGIN_PROPERTIES#
{

}
#END_PROPERTIES#
/**********************
 * domManipulation.js *
 **********************
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

function startLevel(map) {
    map.placePlayer(1, 1);

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

    $dom.find('ul').addClass('drEvalLocation');
    $dom.find('h2').addClass('adversaryLocation');

    map.overrideKey('up', function () {
        var currentPosition = $dom.find('.drEvalLocation');
        if (currentPosition.parent().length > 0 &&
                !currentPosition.parent().hasClass('offLimits')) {
            currentPosition.parent().addClass('drEvalLocation');
            currentPosition.removeClass('drEvalLocation');
            map.updateDOM($dom);
            console.log(currentPosition);
        }
    });

    map.overrideKey('down', function () {
        var currentPosition = $dom.find('.drEvalLocation');
        if (currentPosition.children().length > 0) {
            currentPosition.children().first().addClass('drEvalLocation');
            currentPosition.removeClass('drEvalLocation');
            map.updateDOM($dom);
            console.log(currentPosition);
        }
    });

    map.overrideKey('left', function () {
        var currentPosition = $dom.find('.drEvalLocation');
        if (currentPosition.prev().length > 0) {
            currentPosition.prev().first().addClass('drEvalLocation');
            currentPosition.removeClass('drEvalLocation');
            map.updateDOM($dom);
            console.log(currentPosition);
        }
    });

    map.overrideKey('right', function () {
        var currentPosition = $dom.find('.drEvalLocation');
        if (currentPosition.next().length > 0) {
            currentPosition.next().first().addClass('drEvalLocation');
            currentPosition.removeClass('drEvalLocation');
            map.updateDOM($dom);
            console.log(currentPosition);
        }
    });

    map.createFromDOM($dom);
#END_OF_START_LEVEL#
}
