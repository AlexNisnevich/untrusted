function playIntro(display, map, i) {
	if (i < 0) {
        display._intro = true;
    } else {
        if (typeof i === 'undefined') { i = map.getHeight(); }
        display.clear();
        display.drawText(0, i - 2, "%c{#0f0}> initialize");
        display.drawText(15, i + 3, "U N T R U S T E D");
        display.drawText(20, i + 5, "- or - ");
        display.drawText(5, i + 7, "THE CONTINUING ADVENTURES OF DR. EVAL");
        display.drawText(3, i + 12, "a game by Alex Nisnevich and Greg Shuflin");
        display.drawText(10, i + 22, "Press any key to begin ...");
        setTimeout(function () {
            display.playIntro(map, i - 1);
        }, 100);
    }
}
