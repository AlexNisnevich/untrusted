#BEGIN_PROPERTIES#
{
    "version": "1.0",
    "commandsIntroduced": []
}
#END_PROPERTIES#
/*******************
 * theEmptyRoom.js *
 * from HangoverX  *
 * by janosgyerik  *
 *******************
 *
 * Oh great, an empty room. That's so much better than a desert.
 * Shiny silvery walls and no exit.
 *
 * Oh look, a terminal. You seem to remember something about
 * a previous life, something about "programming", and "languages".
 * Maybe you can hookup your computer with the terminal and see
 * where your instincts take you...
 */

function startLevel(map) {
#START_OF_START_LEVEL#
    map.displayChapter('Chapter 2\nThe Empty Room');

    function getAnswer(input) {
#BEGIN_EDITABLE#
        // Hm, buggy software?
        // Looks like I can inject my own code, right here...

        return 42;
#END_EDITABLE#
    }

    map.defineObject('terminal', {
        'symbol': 'T',
        'color': '#88f',
        'onCollision': function (player) {
            function challenge() {
                var input = parseInt(Math.random() * 50) + 15;
                var expected = {15:610,16:987,17:1597,18:2584,19:4181,20:6765,21:10946,22:17711,23:28657,24:46368,25:75025,26:121393,27:196418,28:317811,29:514229,30:832040,31:1346269,32:2178309,33:3524578,34:5702887,35:9227465,36:14930352,37:24157817,38:39088169,39:63245986,40:102334155,41:165580141,42:267914296,43:433494437,44:701408733,45:1134903170,46:1836311903,47:2971215073,48:4807526976,49:7778742049,50:12586269025,51:20365011074,52:32951280099,53:53316291173,54:86267571272,55:139583862445,56:225851433717,57:365435296162,58:591286729879,59:956722026041,60:1548008755920,61:2504730781961,62:4052739537881,63:6557470319842,64:0x9a661ca20bb,65:0xf9d297a859d,66:27777890035288,67:44945570212853,68:72723460248141,69:0x6b04f4c2fe42,70:0xad2934c6d08f,71:308061521170129,72:498454011879264,73:806515533049393,74:0x4a2dce62b0d91,75:0x780626e057bc2,76:0xc233f54308953,77:5527939700884757,78:8944394323791464,79:0x336a82d89c937c,80:0x533163ef0321e4,81:0x869be6c79fb560,82:0xd9cd4ab6a2d740,83:99194853094755490,84:0x23a367c34e563e0,85:0x39a9fadb327f080,86:0x5d4d629e80d5480,87:0x96f75d79b354500,88:0xf444c0183429980,89:0x18b3c1d91e77de00,90:0x27f80ddaa1ba7800,91:466004661037553e4,92:0x68a3dd8e61ecd000,93:0xa94fad42221f2800,94:0x111f38ad0840c0000,95:319404346349901e5,96:5168070885485833e4,97:8362114348984843e4,98:0x755b0bdd8fa998000,99:2189229958345552e5,100:3542248481792619e5}[input];
                return expected == getAnswer(input);
            }
            if (!challenge()) {
                player.killedBy('wrong answer');
            }
            if (!map.opened) {
                map.writeStatus("*click*");
                map.opened = true;
            }
        }
    });

    var grid = [
      '#####################',
      '#        #x#        #',
      '#        #T#        #',
      '#                   #',
      '#                   #',
      '#                   #',
      '#                   #',
      '#                   #',
      '#             @     #',
      '#                   #',
      '#              e    #',
      '#                   #',
      '#####################'
    ];
    var width = map.getWidth();
    var height = map.getHeight();
    var grid_x = parseInt((width - grid[0].length) / 2);
    var grid_y = parseInt((height - grid.length) / 2);
    map.createFromGrid(grid, {
      'T': 'terminal',
      'x': 'exit',
      '#': 'block',
      '@': 'player',
      'e': 'eye'
    }, grid_x, grid_y);
#END_OF_START_LEVEL#
}

function validateLevel(map) {
    map.validateExactlyXManyObjects(1, 'exit');
}
