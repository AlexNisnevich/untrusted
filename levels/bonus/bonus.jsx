#BEGIN_PROPERTIES#
{
    "version": "1.2.1",
    "commandsIntroduced": ['map.startTimer', "object.setTarget", "map.getDynamicObjects"],
    "music": "Brazil"
}
#END_PROPERTIES#


function startLevel(map) {
#START_OF_START_LEVEL#
 var savedX, savedY, savedDirection;
    function shuffle(o){ //v1.0 [http://bit.ly/1l6LGQT]
        for(var j, x, i = o.length; i; j = Math.floor(Math.random() * i),
            x = o[--i], o[i] = o[j], o[j] = x);
        return o;
    };
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
'o                          #                      ',
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
'xx#                        o                      ',
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
        'o': 'teleporter'
    }, 0, 0);
  function gravity(trigger) {
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

  var teleporters = map.getDynamicObjects();
  teleporters = shuffle(teleporters);
  var t1 = teleporters[0];
  var t2 = teleporters[1];
  t1.setTarget(t2);
  t2.setTarget(t1);

  for(x = 3; x < 26; x++) {
    map.placeObject(x, 10, 'invisibleBoulder');
  }
  for(x = 4; x < 27; x++) {
    map.placeObject(x, 8, 'invisibleBoulder');
  }
  for(x = 0; x < 26; x++) {
    map.placeObject(x, 6, 'invisibleBoulder');
  }
  for(y = 1; y < 6; y++) {
    map.placeObject(25, y, 'invisibleBoulder');
  }
  for(y = 0; y < 5; y++) {
    map.placeObject(23, y, 'invisibleBoulder');
  }
  for(y = 1; y < 6; y++) {
    map.placeObject(21, y, 'invisibleBoulder');
  }
  for(y = 0; y < 5; y++) {
    map.placeObject(19, y, 'invisibleBoulder');
  }
  for(y = 1; y < 6; y++) {
    map.placeObject(17, y, 'invisibleBoulder');
  }
  for(y = 0; y < 5; y++) {
    map.placeObject(15, y, 'invisibleBoulder');
  }
  for(y = 1; y < 6; y++) {
    map.placeObject(13, y, 'invisibleBoulder');
  }
  for(y = 0; y < 5; y++) {
    map.placeObject(11, y, 'invisibleBoulder');
  }
  for(y = 1; y < 6; y++) {
    map.placeObject(9, y, 'invisibleBoulder');
  }
  for(y = 0; y < 5; y++) {
    map.placeObject(7, y, 'invisibleBoulder');
  }
  for(y = 1; y < 6; y++) {
    map.placeObject(5, y, 'invisibleBoulder');
  }
  for(y = 0; y < 5; y++) {
    map.placeObject(3, y, 'invisibleBoulder');
  }

#BEGIN_EDITABLE#
  for(x = 43; x < 46; x++) {
    map.placeObject(x, 1, 'boulder');
    map.placeObject(x, 3, 'boulder');
  }
  map.placeObject(43, 2, 'boulder');
  map.placeObject(45, 2, 'boulder');
  map.placeObject(1, 9, 'boulder');
#END_EDITABLE#
#END_OF_START_LEVEL#
}