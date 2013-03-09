// {"editable": []}
function startLevel(map) {

    display.drawText(1,1, "This is the ELECTRONIC VOID where players go to languish when we run out of levels that we can put together in twelve hours. Farewell, Dr. Eval.");

    map.player = new Player(20, 20);

    map.placeObject(dimensions.width-1, dimensions.height-1, 'exit');
}
