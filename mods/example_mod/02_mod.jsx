#BEGIN_PROPERTIES#
{
    "version": "1.0",
    "music": "Brazil"
}
#END_PROPERTIES#
/**************
 * mod.js *
 *************
 *
 * Congratulations! You'v completed the example of mod.
 *
 * Create your own mod by putting the source code into
 * the directory [mods/$your_mod_name]. When you ready for it,
 * just run [make mod=$your_mod_name] to build it. And you can
 * add this paramater to any [make] command to specify which
 * mod you want to handle.
 * 
 * What are you waiting for? Come on!
 *
 * Create you own mod and enjoy it.
 *
 */

function startLevel(map) {
#START_OF_START_LEVEL#
    var credits = [
        [14, 5, "E X A M P L E of M O D"],
		[10, 7, "%c{#0f0}$%c{#cccccc} make mod=example_mod"],
		[10, 9, "%c{#0f0}$%c{#cccccc} make mod=example_mod release"],
		[10, 11, "%c{#0f0}$%c{#cccccc} make mod=example_mod runlocal"],
	] 

    function drawCredits(i) {
        if (i >= credits.length) {
            return;
        }

        // redraw lines bottom to top to avoid cutting off letters
        for (var j = i; j >= 0; j--) {
            var line = credits[j];
            map._display.drawText(line[0], line[1], line[2]);
        }

        map.timeout(function () {drawCredits(i+1);}, 2000)
    }

    map.timeout(function () {drawCredits(0);}, 4000);

#END_OF_START_LEVEL#
}
