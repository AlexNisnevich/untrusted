function playIntro(display, map, i) {
	if (i < 0) {
        display._intro = true;
    } else {
        if (typeof i === 'undefined') { i = map.getHeight(); }
        display.clear();
        display.drawText(0, i - 2, "%c{#0f0}> initialize");
        display.drawText(13, i + 3, "R I S E O F T H E M O D S");
        display.drawText(22, i + 5, "- or - ");
        display.drawText(16, i + 7, "THE EXAMPLE OF MODS");
        display.drawText(5, i + 12, "a demo that shows how to develop a mod");
        display.drawText(10, i + 22, "Press any key to begin ...");
        setTimeout(function () {
            display.playIntro(map, i - 1);
        }, 100);
    }
}
