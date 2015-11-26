#BEGIN_PROPERTIES#
{
    "version": "1.2.1",
    "commandsIntroduced": [],
    "music": "Brazil"
}
#END_PROPERTIES#


function startLevel(map) {
#START_OF_START_LEVEL#

 function gravity() {
  var x = player.getX();
  var y = player.getY() + 1;

   if(x > 2 && x < 27 && (y === map.getHeight() - 5)) {
     player.killedBy("gravity");
   }
 }

 map.startTimer(gravity,10000000000);
 var savedX, savedY, savedDirection;
    map.defineObject('ice', {
      'symbol': String.fromCharCode(0x2630), 'color': '#75D1FF',
      'impassable': function(player, me) {
        savedX = player.getX();
        savedY = player.getY();
        return false;
      },
      'onCollision': function(player) {
        if (player.getX() == savedX) {
          if (player.getY() > savedY) {
            savedDirection = 'down';
          } else {
            savedDirection = 'up';
          }
        } else {
          if (player.getX() > savedX) {
            savedDirection = 'right';
          } else {
            savedDirection = 'left';
          }
        }
        dirs = ['up', 'down', 'left', 'right'];
        for (d=0;d<dirs.length;d++) {
          if (dirs[d] != savedDirection) {
            map.overrideKey(dirs[d], function(){});
          }
        }
      }
    });
  
    map.startTimer(function() {
      player = map.getPlayer();
      x = player.getX(); y = player.getY();
      if (map.getObjectTypeAt(x,y) == 'ice') {
        player.move(savedDirection);
      }
      if (player.getX() == x && player.getY() == y) {
        map.overrideKey('up', null);
        map.overrideKey('down', null);
        map.overrideKey('left', null);
        map.overrideKey('right', null);
      }
    },200);
  
  map.defineObject('boulder', {
    'symbol': String.fromCharCode(0x2617),
    'color' : '#5C1F00',
    'impassable': true
  });
    map.createFromGrid([
'                           #                      ',
'                           #                      ',
'                           #                E     ',
'                           #                      ',
'                           #                      ',
'                           #                      ',
'                           #                      ',
'###                        #                      ',
'  #                        #                      ',
'  #                        #                      ',
'  #                        #                      ',
'xx                         #                      ',
'xx  ########################                      ',
'xx                         #                      ',
'xx#                        #                      ',
'xx#                        #                      ',
'xx#                        #                      ',
'xx#                        #                      ',
'xx#                                               ',
'xx#                        #                      ',
'xx#                        #                      ',
'xx#                        #                      ',
'xx#                        #                      ',
'xx#                        #                      ',
'@ #                        #                      '],
    {
        '@': 'player',
        'E': 'exit',
        '#': 'boulder',
        'x': 'ice',
        'C': 'computer',
    }, 0, 0);
#BEGIN_EDITABLE#
  for(x = 43; x < 46; x++){
    map.placeObject(x, 1, 'boulder');
    map.placeObject(x, 3, 'boulder');
  }
  map.placeObject(43, 2, 'boulder');
  map.placeObject(45, 2, 'boulder');
  map.placeObject(1, 9, 'boulder');
#END_EDITABLE#
#END_OF_START_LEVEL#
}