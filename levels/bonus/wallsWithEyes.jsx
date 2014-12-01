#BEGIN_PROPERTIES#
{
    "version": "1.2.1",
    "commandsIntroduced":
        ["global.startLevel", "global.onExit", "map.placePlayer",
         "map.placeObject", "map.getHeight", "map.getWidth",
         "map.displayChapter", "map.getaPlayer", "player.hasItem"],
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
 */
 

function startLevel(map) {
#START_OF_START_LEVEL#
    
    for (var i = 0; i < map.getHeight(); i++) {
		for(var j = 0; j < 14; j++){
		map.placeObject(j, i, 'block');
		}
		for(var k = map.getWidth()-13; k<= map.getWidth(); k++){
		map.placeObject(k, i, 'block');
		}
	}

	map.defineObject('pillar', {
		'symbol': String.fromCharCode(0x265C),
		'color' : '#8B4513',
		'impassable': true
	});

    var teleport1X = 30;
    var teleport1Y = 3;
    var teleport2X = 30;
    var teleport2Y = (map.getHeight() - 2);

    map.placeObject(teleport1X, teleport1Y, 'teleporter');
    map.placeObject(teleport2X, teleport2Y, 'teleporter');

    var teleport1;
    var teleport2;
    var dynamicObjects = map.getDynamicObjects();

    for (i = 0; i < dynamicObjects.length; i++) {
        
        var t = dynamicObjects[i];

        if ((t.getX() == teleport1X) && (t.getY() == teleport1Y)) {
            teleport1 = t;
        }
        if ((t.getX() == teleport2X) && (t.getY() == teleport2Y)) {
            teleport2 = t;
        }
    }

    // this line is the solution
    //teleport1.setTarget(teleport2);

	map.createFromGrid(['    +++    ',
						'    +E+    ',
						'           ',
						'P         P',
						'           ',
						'           ',
						'           ',
						'P         P',
						'           ',
						'           ',
						'           ',
						'P         P',
						'           ',
						'           ',
						'           ',
						'P         P',
						'           ',
						'           ',
						'           ',
						'P         P',
						'           ',
						'           ',
						'           ',
						'P    G    P'],
					{
						'E': 'exit',
						'+': 'block',
						'P': 'pillar',
                        'G': 'player',
					}, 20, 1);

    var leftWallBound = 14;
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
            map.writeStatus("It's a trap! You are doomed!");
        }    

        if (doomed) {  
            //increase walls on both sides by one layer of chars
            //left wall add layer
            for (var y = 5; y < (map.getHeight() - 5); y++){
                if (map.getPlayer().atLocation(leftWallBound, y)) {
                    map.getPlayer().killedBy('the collapsing tunnel');
                }
                if (map.getObjectTypeAt(leftWallBound, y) == 'empty'){
                	map.placeObject(leftWallBound, y, 'block');
                }
                if (map.getPlayer().atLocation(rightWallBound, y)) {
                    map.getPlayer().killedBy('the collapsing tunnel');
                }
                if (map.getObjectTypeAt(rightWallBound, y) == 'empty'){
                	map.placeObject(rightWallBound, y, 'block');
                }
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
        'color ': '#999',
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
