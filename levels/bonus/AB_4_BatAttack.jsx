#BEGIN_PROPERTIES#
{
    "version": "1.0",
    "commandsIntroduced":
        ["object.passableFor",
         "map.validateExactlyXManyObjects"],
}
#END_PROPERTIES#
/****************************
 *      BatAttack.js		*
 ****************************
 *
 * As you proceed into the cave
 * you notice some creatures hiding in the darkness.
 * They seem to be asleep... Proceed with care though,
 * for they tend to sleep lightly.
 * Sneaky or smart, you never truly had an option.
 *
 * Every traveller knows that the
 * adventures never truly end.
 */
 

function startLevel(map) {
#START_OF_START_LEVEL#

    function wakeAndHunt(obj, type) {
		var direction;
        var target = obj.findNearest(type);
        var leftDist = obj.getX() - target.x;
        var upDist = obj.getY() - target.y;
		
		if (Math.abs(upDist) < 4 && Math.abs(leftDist) < 8) {			
			if (upDist == 0 && leftDist == 0) {
				return;
			} if (upDist > 0 && upDist >= leftDist) {
				direction = 'up';
			} else if (upDist < 0 && upDist < leftDist) {
				direction = 'down';
			} else if (leftDist > 0 && leftDist >= upDist) {
				direction = 'left';
			} else {
				direction = 'right';
			}
			obj.move(direction);
		}
    }
	
    map.defineObject('bat', {
        'type': 'dynamic',
		'symbol': String.fromCharCode(0x03E1),
        'color': 'purple',
        'onCollision': function (player) {
            player.killedBy('a bat');
        },
        'behavior': function (me) {
            wakeAndHunt(me, 'player');
		}
    });

	map.defineObject('boulder', {
		'color' : '#5C1F00',
		'symbol': String.fromCharCode(0x2617),
		'impassable': true,
        'passableFor': ['bat']
	});
	
	map.createFromGrid(
	['##################################################',
	'####################################    E#########',
	'#############     ##############         #########',
	'############       ############          #########',
	'##########     #    #########     ################',
	'#########     #B#    ###BBB###    ################',
	'#######      #BBB#    #########    ###############',
	'########    #######    ###BBB###    ##############',
	'#######    #########    #########    #############',
	'########    #######    #########    ##############',
	'#######    ###BBB###    ###BBB###    #############',
	'###BBB##    #######    #########    ##############',
	'#######    #########    #########    #############',
	'########    ##BBB##    #########    ##############',
	'#######    #########    ##BBB####    #############',
	'##BBB###    #######    #########    ##############',
	'#######    #########    ########    ##############',
	'########    #######    #######    ################',
	'#######    ###BBB###    #BBB#    #################',
	'########    #######      #B#    ##################',
	'#######    ##########     #    ###################',
	'####         #########        ####################',
	'####        ###########      #####################',
	'#### @     #######################################',
	'##################################################'],
		{
			'@': 'player',
			'E': 'exit',
			'#': 'boulder',
			'B': 'bat',
		}, 0, 0);	
	
#BEGIN_EDITABLE#




#END_EDITABLE#
	
#END_OF_START_LEVEL#
}

function validateLevel(map) {
    map.validateExactlyXManyObjects(1, 'exit');
}

