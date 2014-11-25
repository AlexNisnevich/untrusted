#BEGIN_PROPERTIES#
{
    "version": "1.2.1",
    "commandsIntroduced":
        ["global.startLevel", "global.onExit", "map.placePlayer",
         "map.placeObject", "map.getHeight", "map.getWidth",
         "map.displayChapter", "map.getPlayer", "player.hasItem"],
    "music": "Brazil"
}
#END_PROPERTIES#
/********************
 * wallsWithEyes  *
 * by group19 *
 ********************
 * Good Evening Dr and welcome to the Temple of Doom
 * Do you see your priceless item on that shrine at the end
 * Now do you see that skeleton right underneath
 * Ya...that was Indiana Jones
 * Good luck picking up the item...just remember the walls have eyes...
 * ...If Indiana Jones couldn't get there, what makes you think you will...
 * Commands added
 */
 

function startLevel(map) {
#START_OF_START_LEVEL#
    map.placePlayer(map.getWidth()/ 2, (map.getHeight()-2));
    map.placeObject(map.getWidth()/ 2, 2, 'exit');
	//Should place initial walls from top to bottom of thickness 5
    for (var i = 0; i < map.getHeight(); i++) {
		for(var j = 0; j < 5; j++){
		map.placeObject(j, i, 'block');
		}
		for(var k = map.getWidth()-5; k<= map.getWidth(); k++){
		map.placeObject(k, i, 'block');
		}
	}

    function closeWalls() {
        
        var leftWallBound = 5;
        var rightWallBound = map.getWidth() - 6;
        var playerDir = map.getPlayer().getLastMoveDirection();
        //var playerXCoord = map.getPlayer().getX();

        if (playerDir === 'up'){
            //increase walls on both sides by one layer of chars
            //left wall add layer
            for (var y = 0; y < map.getHeight(); y++){
                map.placeObject(leftWallBound, y, 'block');
            }
            //right wall add layer
            for (var y = 0; y < map.getHeight(); y++){
                map.placeObject(rightWallBound, y, 'block');
            }
            // move both wall bounds inwards by 1 space
            leftWallBound = leftWallBound++;
            rightWallBound = rightWallBound--;
        }
    }

    closeWalls();

#BEGIN_EDITABLE#



#END_EDITABLE#             
#END_OF_START_LEVEL#
}
function validateLevel(map) {
    map.validateExactlyXManyObjects(1, 'exit');
}
