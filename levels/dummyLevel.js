// {"editable": [[3, 4]]}
function startLevel(map) {

    display.drawText(1,1, "This is a dummy level. The player is never supposed to get here");

    map.player = new Player(20, 20);

    // exit square always at bottom right corner
    map.placeObject(dimensions.width-1, dimensions.height-1, 'exit');
}
