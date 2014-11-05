#BEGIN_PROPERTIES#
{
    "version": "0.0",
    "commandsIntroduced": []
}
#END_PROPERTIES#
/*******************
 *      ice.js     *
 *    by mdejean   *
 *******************
 *
 */

function startLevel(map) {
#START_OF_START_LEVEL#
    var savedX, savedY, savedDirection;
    map.defineObject('ice', {
      'symbol': '.', 'color': '#00f',
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
    map.createFromGrid(
       ['+++++++++++++++++++++++++++++++',
        '+               +++           +',
        '+              ++E+           +',
        '+              xxxx           +',
        '+              xxxx           +',
        '+              xxxx           +',
        '+              xxxx           +',
        '+              @+++           +',
        '+                             +',
        '+                             +',
        '+                             +',
        '+                             +',
        '+                             +',
        '+                             +',
        '+++++++++++++++++++++++++++++++'],
    {
        '@': 'player',
        'E': 'exit',
        '+': 'block',
        'x': 'ice',
    }, 6, 6);
#BEGIN_EDITABLE#

#END_EDITABLE#

#END_OF_START_LEVEL#
}

function validateLevel(map) {
    map.validateExactlyXManyObjects(0, 'phone');
    map.validateExactlyXManyObjects(0, 'theAlgorithm');
    map.validateExactlyXManyObjects(1, 'exit');
    map.validateAtMostXDynamicObjects(0);
}
