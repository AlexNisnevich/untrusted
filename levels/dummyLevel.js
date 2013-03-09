// {"editable": []}
function startLevel(map) {
    map.placePlayer(map.getWidth()-1, map.getHeight()-1);
    map.placeObject(1, map.getHeight()-1, 'exit');
    display.drawAll(map);

    display.drawText(1,1, "This is the ELECTRONIC VOID where players go to languish when we run out of levels that we can put together in twelve hours. Farewell, Dr. Eval.");
}
