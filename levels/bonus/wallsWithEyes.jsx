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
		for(var j = 0; j < 13; j++){
		map.placeObject(j, i, 'block');
		}
		for(var k = map.getWidth()-13; k<= map.getWidth(); k++){
		map.placeObject(k, i, 'block');
		}
	}

    var leftWallBound = 13;
    var rightWallBound = map.getWidth() - 14;
    //flag for if player has passed a certain point
    //walls start closing in once this is true
    var doomed = false;

    function closeWalls(map) {
        
        //var leftWallBound = 5;
        //var rightWallBound = map.getWidth() - 6;
        var playerDir = map.getPlayer().getLastMoveDirection();
        var playerYCoord = map.getPlayer().getY();

        if (playerYCoord < (map.getHeight()/2 + 5)) {
            doomed = true;

            //TODO: add a popup message that says:
            //"You have chosen poorly and triggered a trap! You are doomed!"    
        }    

        if (doomed) {  
            //increase walls on both sides by one layer of chars
            //left wall add layer
            for (var y = 5; y < (map.getHeight() - 5); y++){
                if (map.getPlayer().atLocation(leftWallBound, y)) {
                    map.getPlayer().killedBy('the collapsing tunnel');
                }
                map.placeObject(leftWallBound, y, 'block');
                if (map.getPlayer().atLocation(rightWallBound, y)) {
                    map.getPlayer().killedBy('the collapsing tunnel');
                }
                map.placeObject(rightWallBound, y, 'block');
            }
        
            // move both wall bounds inwards by 1 space
            leftWallBound++; 
            rightWallBound--; 
        }
    }

    //make an object of type wallcloser to use closeWalls function
    map.defineObject('wallsOfDeath', {
        'type': 'dynamic',
        'symbol': '#',
        'color ': 'grey',
        'behavior': function() {
            closeWalls(map)
        }
    });
    map.placeObject(1, 1, 'wallsOfDeath');

#BEGIN_EDITABLE#



#END_EDITABLE#             
#END_OF_START_LEVEL#
}
function validateLevel(map) {
    map.validateExactlyXManyObjects(1, 'exit');
}
