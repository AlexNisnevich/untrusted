#BEGIN_PROPERTIES#
{
    "version": "1.2.2",
    "commandsIntroduced": [],
    "music": "Brazil"
}
#END_PROPERTIES#


function startLevel(map) {
#START_OF_START_LEVEL#
 var savedX, savedY, savedDirection;

    function moveToward(obj, type) {
        var target = obj.findNearest(type);
        var leftDist = obj.getX() - target.x;
        var upDist = obj.getY() - target.y;

        var direction;
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

        if (obj.canMove(direction)) {
            obj.move(direction);
        }
    }

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
        var dirs = ['up', 'down', 'left', 'right'];
        for (var d=0;d<dirs.length;d++) {
          if (dirs[d] != savedDirection) {
            map.overrideKey(dirs[d], function(){});
          }
        }
      }
    });
  
    map.startTimer(function() {
      var player = map.getPlayer();
      var x = player.getX(), y = player.getY();
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

  map.defineObject('water', {
      'symbol': '░',
      'color': '#44f',
      'onCollision': function (player) {
          player.killedBy#{#('drowning in deep dark water')#}#;
      }
  });

  map.defineObject('invisibleBoulder', {
    'symbol' : String.fromCharCode(0x2617),
    'color' : '#000000',
    'impassable' : true
  });

  map.defineObject('zombie', {
      'type': 'dynamic',
      'symbol': 'z',
      'color': 'red',
      'onCollision': function (player) {
          player.killedBy('Zombie');
      },
      'behavior': function (me) {
#BEGIN_EDITABLE#
          var player = map.getPlayer();
          var x = player.getX();
          var y = player.getY();
          /*Hint: There is a me.canMove method for zombies, for example if me.canMove('right')
          is true, then it means that the zombie is able to move right at that specific point in time
          //Hint 2: You can specify where the zombie will move with ex: me.move('right')
          */
          if(x > 40 && x < 45){
            if(y >= 13){
              moveToward(me, 'player');
            }
          }
#END_EDITABLE#
        }
    });
    map.defineObject('blueLock', {
        'symbol': String.fromCharCode(0x2297),
        'color': '#06f',
        'impassable': function (player) {
            if (player.hasItem('blueKey')) {
                player.removeItem('blueKey');
                return false;
            } else {
                return true;
            }
        }
    });

    map.defineObject('yellowLock', {
        'symbol': String.fromCharCode(0x2297),
        'color': 'yellow',
        'impassable': function (player) {
            if (player.hasItem('yellowKey')) {
                player.removeItem('yellowKey');
                return false;
            } else {
                return true;
            }
        }
    });

    map.createFromGrid([
'o                          #         #            ',
'xx                         #         #            ',
'xx                         #         B      E     ',
'xx                         #         #            ',
'xx                         #         #            ',
'xx                         #         #############',
'                           #                     b',
'###                        ##Y####################',
'  #                        #                      ',
'  #                        ######### #############',
'  #                        #xxxxxxxxxxxxxxxxxxxxx ',
'xx                         #y        xxxxxxxxxxxx ',
'xx  ############################################# ',
'xx                         o                 #    ',
'xx#                        ##          ##    #    ',
'xx#                        ##wwwwwwwwww##    #    ',
'xx#                        ##wwwwwwwwww##    #    ',
'xx#                        ##wwwwwwwwww##    #    ',
'xx#                        ##wwwwwwwwww##    #    ',
'xx#                        ##wwwwwwwwww##    #    ',
'xx#                        ##wwwwwwwwww##    #    ',
'xx#                        ##wwwwwwwwww##    #    ',
'xx#                        ##wwwwwwwwww##    #    ',
'xx#                        ##wwwwwwwwww##    #    ',
'@ #                        ##wwwwwwwwww##zzzz     '],
    {
        '@': 'player',
        'E': 'exit',
        '#': 'boulder',
        'i': 'invisibleBoulder',
        'x': 'ice',
        'o': 'teleporter',
        'w': 'water',
        'z': 'zombie',
        'b': 'blueKey',
        'y': 'yellowKey',
        'B': 'blueLock',
        'Y': 'yellowLock',
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

  function waterGravity() {
    var player = map.getPlayer();
    var x = player.getX();
    var y = player.getY() + 1;
    if(x > 28 && x < 39) {
      if(y >= 13){
        player.move('down');
      }
    }
  }
  map.startTimer(waterGravity, 45);

  var teleporters = map.getDynamicObjects();
  teleporters = shuffle(teleporters);
  var t1, t2;
  for(var i = 0; i < teleporters.length; i++){
    if(teleporters[i].getType() == 'teleporter'){
      t1 = teleporters[i];
    }
  }
  for(var j = teleporters.length - 1; j >= 0; j--){
    if(teleporters[j].getType() == 'teleporter'){
      t2 = teleporters[j];
    }
  }
  t1.setTarget(t2);
  t2.setTarget(t1);

  for(var x = 3; x < 26; x++) {
    map.placeObject(x, 10, 'invisibleBoulder');
  }
  for(var x = 4; x < 27; x++) {
    map.placeObject(x, 8, 'invisibleBoulder');
  }
  for(var x = 0; x < 26; x++) {
    map.placeObject(x, 6, 'invisibleBoulder');
  }
  for(var y = 1; y < 6; y++) {
    map.placeObject(25, y, 'invisibleBoulder');
  }
  for(var y = 0; y < 5; y++) {
    map.placeObject(23, y, 'invisibleBoulder');
  }
  for(var y = 1; y < 6; y++) {
    map.placeObject(21, y, 'invisibleBoulder');
  }
  for(var y = 0; y < 5; y++) {
    map.placeObject(19, y, 'invisibleBoulder');
  }
  for(var y = 1; y < 6; y++) {
    map.placeObject(17, y, 'invisibleBoulder');
  }
  for(var y = 0; y < 5; y++) {
    map.placeObject(15, y, 'invisibleBoulder');
  }
  for(var y = 1; y < 6; y++) {
    map.placeObject(13, y, 'invisibleBoulder');
  }
  for(var y = 0; y < 5; y++) {
    map.placeObject(11, y, 'invisibleBoulder');
  }
  for(var y = 1; y < 6; y++) {
    map.placeObject(9, y, 'invisibleBoulder');
  }
  for(var y = 0; y < 5; y++) {
    map.placeObject(7, y, 'invisibleBoulder');
  }
  for(var y = 1; y < 6; y++) {
    map.placeObject(5, y, 'invisibleBoulder');
  }
  for(var y = 0; y < 5; y++) {
    map.placeObject(3, y, 'invisibleBoulder');
  }

#BEGIN_EDITABLE#
  for(var x = 43; x < 46; x++) {
    map.placeObject(x, 1, 'boulder');
    map.placeObject(x, 3, 'boulder');
  }
  map.placeObject(43, 2, 'boulder');
  map.placeObject(45, 2, 'boulder');
  map.placeObject(1, 9, 'boulder');
  map.placeObject(30, 14, 'boulder');
  map.placeObject(36, 11, 'boulder');
  for(var x = map.getWidth() - 13; x < map.getWidth() - 1; x++) {
    map.placeObject(x, 6, 'boulder');
  }
#END_EDITABLE#
#END_OF_START_LEVEL#
}

function validateLevel(map) {
  map.validateExactlyXManyObjects(0, 'phone');
  map.validateExactlyXManyObjects(0, 'theAlgorithm');
  map.validateExactlyXManyObjects(1, 'exit');
  map.validateExactlyXManyObjects(0, 'computer');
  map.validateAtMostXDynamicObjects(6);
}