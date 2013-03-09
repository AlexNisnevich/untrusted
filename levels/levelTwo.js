// {"editable": [[3, 4]]}
function startLevel(map) {
    for (y = 15; y <= dimensions.height - 5; y++) {
        map.placeObject(5, y, 'block');
        map.placeObject(dimensions.width - 5, y, 'block');
    }

    for (x = 5; x <= dimensions.width - 5; x++) {
        map.placeObject(x, 5, 'block');
        map.placeObject(x, dimensions.height - 5, 'block');
    }

    map.player = new Player(18, 18);

    // exit square always at bottom right corner
    map.placeObject(dimensions.width-1, dimensions.height-1, 'exit');
}
