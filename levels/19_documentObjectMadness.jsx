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

    var html = "<div class='pageContainer'>" +
    "<div style='width: 600px; height: 500px; background-color: white; font-size: 10px;'>" +
        "<center><h1>Department of Theoretical Computation</h1></center>" +
        "<hr />" +
        "<table border='0'><tr valign='top'>" +
            "<td><div id='face' /></td>" +
            "<td>" +
                "<h2>Cornelius Eval</h2>" +
                "<h3>Associate Professor of Computer Science</h3>" +
                "<ul>" +
                    "<li>BS, Mathematics, University of Manitoba</li>" +
                    "<li>PhD, Theoretical Computation, <a href='http://www.mit.edu'>MIT</a></li>" +
                "</ul>" +
            "</td>" +
        "</tr></table>" +
        "<h4>About me</h4>" +
        "<p>I am an associate professor of computer science, attached to the Department of " +
        "Theoretical Computation. My current research interests include the human-machine " +
        "interface, NP complete problems, and parallelized mesh mathematics.</p>" +
        "<p>I am also the current faculty advisor to the <a href=''>undergraduate Super Smash Bros. team</a>. " +
        "In my spare time I enjoy polka and dirtbiking. </p>" +

        "<div id='class_schedule'>" +
          "<h4>Class Schedule</h4>" +
            "<table>" +
             "<tr>" +
                "<th>Monday</th><th>Tuesday</th><th>Wednesday</th><th>Thursday</th><th>Friday</th>" +
             "</tr>" +
             "<tr>" +
                "<td>CS145 - Semicolons</td><td>Nothing Planned</td><td>CS145 - Semicolons</td><td>CS199 - Practical Theorycrafting </td><td>CS145 - Semicolons</td>" +
             "</tr>" +
            "</table>" +
        "</div>" +
        "<div id='loremIpsum'>" +
        "<h4>Lorem Ipsum</h4>" +
          "<blockquote>" +
            "<code>Neque porro quisquam est qui dolorem ipsum quia dolor sit amet, consectetur, adipisci " +
            "velit, sed quia nonnumquam eiusmodi tempora incidunt ut labore et dolore magnam aliquam quaerat " +
            "voluptatem.</code>" +
            "<footer>— " +
              "<cite>Cicero, De Finibus Bonorum et Malorum</cite>" +
            "</footer>" +
          "</blockquote>" +
        "</div>" +
    "</div></div>";

    var $dom = $(html);

    $dom.find('ul').addClass('drEvalLocation');
    $dom.find('h2').addClass('adversaryLocation');

    map.overrideKey('up', function () {
        var currentPosition = $dom.find('.drEvalLocation');
        if (currentPosition.parent().length > 0 &&
                !currentPosition.parent().hasClass('pageContainer')) {
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
