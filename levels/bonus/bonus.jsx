#BEGIN_PROPERTIES#
{
    "version": "1.2.1",
    "commandsIntroduced": ['map.startTimer'],
    "music": "Brazil"
}
#END_PROPERTIES#


function startLevel(map) {
#START_OF_START_LEVEL#
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

  map.defineObject('invisibleBoulder', {
    'symbol' : String.fromCharCode(0x2617),
    'color' : '#000000',
    'impassable' : true
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
        'i': 'invisibleBoulder',
        'x': 'ice',
        'C': 'computer',
    }, 0, 0);
  function gravity() {
    var player = map.getPlayer();
    var x = player.getX();
    var y = player.getY() + 1;
    if(x > 2 && x < 27){
      if(y >= 13){
        player.move('down');
      }
      if(y >= 21){
        player.killedBy('gravity');
      }
    }
  }
  map.startTimer(gravity,45);

  map.placeObject(0, 0, 'phone');
  map.getPlayer().setPhoneCallback(function () {

  });
#BEGIN_EDITABLE#
  for(x = 43; x < 46; x++) {
    map.placeObject(x, 1, 'boulder');
    map.placeObject(x, 3, 'boulder');
  }
  map.placeObject(43, 2, 'boulder');
  map.placeObject(45, 2, 'boulder');
  map.placeObject(1, 9, 'boulder');
  for(x = 3; x < 26; x++) {
    map.placeObject(x, 10, 'invisibleBoulder');
  }
  for(x = 4; x < 27; x++) {
    map.placeObject(x, 8, 'invisibleBoulder');
  }
#END_EDITABLE#
#END_OF_START_LEVEL#
}