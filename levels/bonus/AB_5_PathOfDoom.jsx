#BEGIN_PROPERTIES#
{
    "version": "1.0"
}
#END_PROPERTIES#
/********************************
 *         PathOfDooM.js		*
 ********************************
 *
 * The path ahead is a treacherous one
 * and bears many dangers. The trap is
 * not to be feared, but trampled for
 * it is the only way forward. Don't 
 * forget that what keeps you in here
 * might as well be the only thing still
 * protecting you.
 * 
 * Every traveller knows that the
 * adventures never truly end.
 */
 

function startLevel(map) {
#START_OF_START_LEVEL#


	map.defineObject('boulder', {
		'symbol': String.fromCharCode(0x2617),
		'color' : '#5C1F00',
		'impassable': true
	});
	

	map.defineObject('plate', {
        'type': 'static',
        'symbol': String.fromCharCode(0x2617),
        'color': 'white',
        'onCollision': function (me) {
			map.startTimer(arrows, 200);
        },   
	});
	
	map.defineObject('switch', {
        'type': 'static',
        'symbol': String.fromCharCode(0x2617),
        'color': 'red',
        'onCollision': function (me) {
#BEGIN_EDITABLE#




#END_EDITABLE#
        }		
		
	});
	
    map.defineObject('arrow', {
        'type': 'dynamic',
        'symbol': '<',
        'color': 'green',
        'interval': 100,
        'projectile': true,
        'behavior': function (me) {
            me.move('left');
        }
    });	

    function arrows() {
		for (var x = 8; x <= 12; x++) {
			map.placeObject(map.getWidth()-3, x, 'arrow');
		}
    }
	
	map.createFromGrid(
	['##################################################',
	'##################################################',
	'##### S ##########################################',
	'####      ########################################',
	'#####     ########################################',
	'######     #######################################',
	'#####     ########################################',
	'####      ########################################',
	'####                                            ##',
	'####                                            ##',
	'###                                             ##',
	'#####                                           ##',
	'######                                          ##',
	'########p#################################   #####',
	'#######   ################################   #####',
	'#######    ###############################   #####',
	'#######    ###############################   #####',
	'########    ##############################   #####',
	'#######     ##############################   #####',
	'#######     ##############################   #####',
	'######     ############################### E #####',
	'####         #####################################',
	'####    @   ######################################',
	'#####      #######################################',
	'######    ########################################'],
		{
			'@': 'player',
			'E': 'exit',
			'S': 'switch',
			'p': 'plate',
			'#': 'boulder'			
		}, 0, 0);	

		
#END_OF_START_LEVEL#
}

function validateLevel(map) {
    map.validateExactlyXManyObjects(1, 'exit');
}

