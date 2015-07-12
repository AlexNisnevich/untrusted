#BEGIN_PROPERTIES#
{
    "version": "0.0",
    "commandsIntroduced": []
}
#END_PROPERTIES#
/*******************
 * <level name>.js *
 *    by mdejean   *
 *******************
 */

function startLevel(map) {
#START_OF_START_LEVEL#
    map.defineObject('door', {
      'symbol': '-', 'color': '#0f0',
      'impassable': function(player) {
        if (player.getColor() == this.color) {
          player.setColor('red');
          return false;
        }
        return true;
      }
    });
    map.createFromGrid(
       ['+++++++++++++++',
        '+        +    +',
        '+          ++ +',
        '+      @  ++x +',
        '+         ++x++',
        '+         ++E++',
        '+++++++++++++++'],
    {
        '@': 'player',
        'E': 'exit',
        '+': 'block',
        'x': 'door',
    }, 17, 6);
#BEGIN_EDITABLE#

#END_EDITABLE#

#END_OF_START_LEVEL#
}

function validateLevel(map) {
    map.validateExactlyXManyObjects(0, 'phone');
    map.validateExactlyXManyObjects(0, 'theAlgorithm');
    map.validateExactlyXManyObjects(1, 'exit');
    map.validateNoTimers();
    map.validateAtMostXDynamicObjects(0);
}
