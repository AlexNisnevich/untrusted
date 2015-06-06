#BEGIN_PROPERTIES#
{
    "version": "1.0",
	"mapProperties": {
        "allowOverwrite": true
    }
}
#END_PROPERTIES#
/***************************
 *      ANewJourney.js     *
 ***************************
 * Hello young traveler!
 *
 * We are in dire need of an adventurer
 * to brave the dangers and use his wits
 * to escape the traps and retrieve the
 * ultimate prize...
 *
 * You will know when you see it.
 *
 * The entrance to the cave is said to be
 * magical and protected by a spell
 * to keep people out, but I trust you
 * to find a way.
 * 
 * Every traveller knows that the
 * adventures never truly end.
 */
 
 function getRandomInt(min, max) {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}
 
function startLevel(map) {
#START_OF_START_LEVEL#
	
    map.createFromGrid(
['                       xxxxxxxxxxxxxxxxxxxxxxxx  ',
'                        xxxxxxxx xxxxxxxxx xxxxx  ',
'                         xxxxxxxxxxxx xxxxxxxxxx  ',
'                             xxxxxxxxxxxxxxxxxxx  ',
'                          xxxxxxxxxxxxxxxx xxxxx  ',
'                            xxxxxxxxxxxxxxxxxxxx  ',
'                               xxx xxxxxxxxxxxxx  ',
'                                xxxxxxxxxx xxxxx  ',
'                                 xxxxxxxxxxxxxxx  ',
'                                                  ',
'                                                  ',
'                                                  ',
'                                                  ',
'                                                  ',
'                                                  ',
'                                                  ',
'                                                  ',
'                                                  ',
'                                                  ',
'                                                  ',
'                                                  ',
'                                                  ',
'                                                 ',
'     C                                            ',
'     @                                            '],
    {
        '@': 'player',
        'E': 'exit',
        '#': 'block',
        'x': 'tree',
        'C': 'computer',
    }, 0, 0);
	
	
	var exit_place = getRandomInt(0, 5);
	if(exit_place == 0){
		map.placeObject(map.getWidth()-8, 1, 'exit');
	}
	else if(exit_place == 1){
		map.placeObject(map.getWidth()-18, 1, 'exit');
	}
	else if(exit_place == 2){
		map.placeObject(map.getWidth()-13, 2, 'exit');
	}
	else if(exit_place == 3){
		map.placeObject(map.getWidth()-8, 4, 'exit')
	}
	else if(exit_place == 4){
		map.placeObject(map.getWidth()-8, 7, 'exit')
	}
	else{
		map.placeObject(map.getWidth()-16, 6, 'exit')
	}
	
#BEGIN_EDITABLE#

#END_EDITABLE#

#END_OF_START_LEVEL#
}

function validateLevel(map) {
    map.validateExactlyXManyObjects(1, 'exit');
}
